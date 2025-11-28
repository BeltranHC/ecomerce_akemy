import { PrismaService } from '../prisma/prisma.service';
export declare class WishlistService {
    private prisma;
    constructor(prisma: PrismaService);
    getWishlist(userId: string): Promise<({
        category: {
            name: string;
            description: string | null;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            image: string | null;
            parentId: string | null;
            sortOrder: number;
        };
        brand: {
            name: string;
            description: string | null;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            logo: string | null;
        } | null;
        images: {
            id: string;
            url: string;
            sortOrder: number;
            productId: string;
            alt: string | null;
            isPrimary: boolean;
        }[];
    } & {
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProductStatus;
        sku: string;
        barcode: string | null;
        slug: string;
        shortDescription: string | null;
        price: import("@prisma/client/runtime/library").Decimal;
        comparePrice: import("@prisma/client/runtime/library").Decimal | null;
        costPrice: import("@prisma/client/runtime/library").Decimal | null;
        stock: number;
        lowStockAlert: number;
        weight: import("@prisma/client/runtime/library").Decimal | null;
        categoryId: string;
        brandId: string | null;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
    })[]>;
    getWishlistIds(userId: string): Promise<string[]>;
    addToWishlist(userId: string, productId: string): Promise<{
        product: {
            brand: {
                name: string;
                description: string | null;
                isActive: boolean;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                logo: string | null;
            } | null;
            images: {
                id: string;
                url: string;
                sortOrder: number;
                productId: string;
                alt: string | null;
                isPrimary: boolean;
            }[];
        } & {
            name: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ProductStatus;
            sku: string;
            barcode: string | null;
            slug: string;
            shortDescription: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            comparePrice: import("@prisma/client/runtime/library").Decimal | null;
            costPrice: import("@prisma/client/runtime/library").Decimal | null;
            stock: number;
            lowStockAlert: number;
            weight: import("@prisma/client/runtime/library").Decimal | null;
            categoryId: string;
            brandId: string | null;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
    }>;
    removeFromWishlist(userId: string, productId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
    }>;
    toggleWishlist(userId: string, productId: string): Promise<{
        added: boolean;
        message: string;
    }>;
    isInWishlist(userId: string, productId: string): Promise<boolean>;
    clearWishlist(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getWishlistCount(userId: string): Promise<number>;
}
