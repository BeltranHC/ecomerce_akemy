"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cart_service_1 = require("./cart.service");
const add_to_cart_dto_1 = require("./dto/add-to-cart.dto");
const update_cart_item_dto_1 = require("./dto/update-cart-item.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../auth/guards/optional-jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    getCart(sessionId, userId) {
        return this.cartService.getOrCreateCart(userId, sessionId);
    }
    addItem(addToCartDto, sessionId, userId) {
        return this.cartService.addItem(addToCartDto, userId, sessionId);
    }
    updateItem(itemId, updateDto, sessionId, userId) {
        return this.cartService.updateItem(itemId, updateDto, userId, sessionId);
    }
    removeItem(itemId, sessionId, userId) {
        return this.cartService.removeItem(itemId, userId, sessionId);
    }
    clearCart(sessionId, userId) {
        return this.cartService.clearCart(userId, sessionId);
    }
    transferCart(sessionId, userId) {
        return this.cartService.transferCart(sessionId, userId);
    }
};
exports.CartController = CartController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener carrito' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false }),
    __param(0, (0, common_1.Headers)('x-session-id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.Post)('items'),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar item al carrito' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_to_cart_dto_1.AddToCartDto, String, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addItem", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.Patch)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar cantidad de item' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)('x-session-id')),
    __param(3, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cart_item_dto_1.UpdateCartItemDto, String, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateItem", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.Delete)('items/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar item del carrito' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Headers)('x-session-id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Vaciar carrito' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: false }),
    __param(0, (0, common_1.Headers)('x-session-id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
__decorate([
    (0, common_1.Post)('transfer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Transferir carrito de sesión a usuario' }),
    (0, swagger_1.ApiHeader)({ name: 'x-session-id', required: true }),
    __param(0, (0, common_1.Headers)('x-session-id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "transferCart", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('cart'),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map