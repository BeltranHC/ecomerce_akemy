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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(userId, sessionId) {
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Se requiere userId o sessionId');
        }
        let cart;
        if (userId) {
            cart = await this.prisma.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    price: true,
                                    comparePrice: true,
                                    stock: true,
                                    status: true,
                                    images: {
                                        where: { isPrimary: true },
                                        take: 1,
                                    },
                                },
                            },
                            variant: true,
                        },
                    },
                },
            });
            if (!cart) {
                cart = await this.prisma.cart.create({
                    data: { userId },
                    include: {
                        items: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        slug: true,
                                        price: true,
                                        comparePrice: true,
                                        stock: true,
                                        status: true,
                                        images: {
                                            where: { isPrimary: true },
                                            take: 1,
                                        },
                                    },
                                },
                                variant: true,
                            },
                        },
                    },
                });
            }
        }
        else if (sessionId) {
            cart = await this.prisma.cart.findUnique({
                where: { sessionId },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    price: true,
                                    comparePrice: true,
                                    stock: true,
                                    status: true,
                                    images: {
                                        where: { isPrimary: true },
                                        take: 1,
                                    },
                                },
                            },
                            variant: true,
                        },
                    },
                },
            });
            if (!cart) {
                cart = await this.prisma.cart.create({
                    data: { sessionId },
                    include: {
                        items: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        slug: true,
                                        price: true,
                                        comparePrice: true,
                                        stock: true,
                                        status: true,
                                        images: {
                                            where: { isPrimary: true },
                                            take: 1,
                                        },
                                    },
                                },
                                variant: true,
                            },
                        },
                    },
                });
            }
        }
        return this.calculateCartTotals(cart);
    }
    async addItem(addToCartDto, userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        const product = await this.prisma.product.findUnique({
            where: { id: addToCartDto.productId },
            include: { variants: true },
        });
        if (!product || product.status !== 'PUBLISHED') {
            throw new common_1.BadRequestException('Producto no disponible');
        }
        let stock = product.stock;
        if (addToCartDto.variantId) {
            const variant = product.variants.find(v => v.id === addToCartDto.variantId);
            if (!variant || !variant.isActive) {
                throw new common_1.BadRequestException('Variante no disponible');
            }
            stock = variant.stock;
        }
        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId: addToCartDto.productId,
                variantId: addToCartDto.variantId || null,
            },
        });
        const newQuantity = existingItem
            ? existingItem.quantity + addToCartDto.quantity
            : addToCartDto.quantity;
        if (newQuantity > stock) {
            throw new common_1.BadRequestException('Stock insuficiente');
        }
        if (existingItem) {
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
            });
        }
        else {
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: addToCartDto.productId,
                    variantId: addToCartDto.variantId,
                    quantity: addToCartDto.quantity,
                },
            });
        }
        return this.getOrCreateCart(userId, sessionId);
    }
    async updateItem(itemId, updateDto, userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        const item = await this.prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId: cart.id,
            },
            include: {
                product: {
                    include: { variants: true },
                },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Item no encontrado en el carrito');
        }
        let stock = item.product.stock;
        if (item.variantId) {
            const variant = item.product.variants.find(v => v.id === item.variantId);
            stock = variant?.stock || 0;
        }
        if (updateDto.quantity > stock) {
            throw new common_1.BadRequestException('Stock insuficiente');
        }
        if (updateDto.quantity <= 0) {
            await this.prisma.cartItem.delete({
                where: { id: itemId },
            });
        }
        else {
            await this.prisma.cartItem.update({
                where: { id: itemId },
                data: { quantity: updateDto.quantity },
            });
        }
        return this.getOrCreateCart(userId, sessionId);
    }
    async removeItem(itemId, userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        const item = await this.prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId: cart.id,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Item no encontrado en el carrito');
        }
        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });
        return this.getOrCreateCart(userId, sessionId);
    }
    async clearCart(userId, sessionId) {
        const cart = await this.getOrCreateCart(userId, sessionId);
        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        return this.getOrCreateCart(userId, sessionId);
    }
    async transferCart(sessionId, userId) {
        const sessionCart = await this.prisma.cart.findUnique({
            where: { sessionId },
            include: { items: true },
        });
        if (!sessionCart || sessionCart.items.length === 0) {
            return this.getOrCreateCart(userId);
        }
        let userCart = await this.prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        });
        if (!userCart) {
            userCart = await this.prisma.cart.create({
                data: { userId },
                include: { items: true },
            });
        }
        for (const item of sessionCart.items) {
            const existingItem = userCart.items.find(i => i.productId === item.productId && i.variantId === item.variantId);
            if (existingItem) {
                await this.prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: existingItem.quantity + item.quantity },
                });
            }
            else {
                await this.prisma.cartItem.create({
                    data: {
                        cartId: userCart.id,
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                    },
                });
            }
        }
        await this.prisma.cart.delete({
            where: { id: sessionCart.id },
        });
        return this.getOrCreateCart(userId);
    }
    calculateCartTotals(cart) {
        let subtotal = 0;
        let totalItems = 0;
        const items = cart.items.map((item) => {
            const price = item.variant?.price
                ? Number(item.variant.price)
                : Number(item.product.price);
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;
            totalItems += item.quantity;
            return {
                ...item,
                price,
                total: itemTotal,
            };
        });
        return {
            id: cart.id,
            items,
            subtotal,
            totalItems,
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map