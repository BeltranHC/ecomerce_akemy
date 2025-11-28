import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(sessionId?: string, userId?: string): Promise<{
        id: any;
        items: any;
        subtotal: number;
        totalItems: number;
    }>;
    addItem(addToCartDto: AddToCartDto, sessionId?: string, userId?: string): Promise<{
        id: any;
        items: any;
        subtotal: number;
        totalItems: number;
    }>;
    updateItem(itemId: string, updateDto: UpdateCartItemDto, sessionId?: string, userId?: string): Promise<{
        id: any;
        items: any;
        subtotal: number;
        totalItems: number;
    }>;
    removeItem(itemId: string, sessionId?: string, userId?: string): Promise<{
        id: any;
        items: any;
        subtotal: number;
        totalItems: number;
    }>;
    clearCart(sessionId?: string, userId?: string): Promise<{
        id: any;
        items: any;
        subtotal: number;
        totalItems: number;
    }>;
    transferCart(sessionId: string, userId: string): Promise<{
        id: any;
        items: any;
        subtotal: number;
        totalItems: number;
    }>;
}
