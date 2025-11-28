import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getOrCreateCart(userId?: string, sessionId?: string): Promise<{
        id: any;
        items: any;
        subtotal: number;
        totalItems: number;
    }>;
    addItem(addToCartDto: AddToCartDto, userId?: string, sessionId?: string): Promise<{
        id: any;
        items: any;
        subtotal: number;
        totalItems: number;
    }>;
    updateItem(itemId: string, updateDto: UpdateCartItemDto, userId?: string, sessionId?: string): Promise<{
        id: any;
        items: any;
        subtotal: number;
        totalItems: number;
    }>;
    removeItem(itemId: string, userId?: string, sessionId?: string): Promise<{
        id: any;
        items: any;
        subtotal: number;
        totalItems: number;
    }>;
    clearCart(userId?: string, sessionId?: string): Promise<{
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
    private calculateCartTotals;
}
