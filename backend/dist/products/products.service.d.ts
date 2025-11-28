import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus, MovementType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto, userId?: string): Promise<{
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
        price: Decimal;
        comparePrice: Decimal | null;
        costPrice: Decimal | null;
        stock: number;
        lowStockAlert: number;
        weight: Decimal | null;
        categoryId: string;
        brandId: string | null;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    findAll(params: {
        page?: number;
        limit?: number;
        search?: string;
        categoryId?: string;
        brandId?: string;
        status?: ProductStatus;
        isFeatured?: boolean;
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        data: ({
            category: {
                name: string;
                id: string;
                slug: string;
            };
            brand: {
                name: string;
                id: string;
                slug: string;
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
            price: Decimal;
            comparePrice: Decimal | null;
            costPrice: Decimal | null;
            stock: number;
            lowStockAlert: number;
            weight: Decimal | null;
            categoryId: string;
            brandId: string | null;
            isFeatured: boolean;
            metaTitle: string | null;
            metaDescription: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findAllPublished(params: {
        page?: number;
        limit?: number;
        search?: string;
        categorySlug?: string;
        brandSlug?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        data: {
            category: {
                name: string;
                id: string;
                slug: string;
            };
            brand: {
                name: string;
                id: string;
                slug: string;
            } | null;
            name: string;
            id: string;
            sku: string;
            slug: string;
            price: Decimal;
            comparePrice: Decimal | null;
            stock: number;
            images: {
                id: string;
                url: string;
                sortOrder: number;
                productId: string;
                alt: string | null;
                isPrimary: boolean;
            }[];
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
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
        variants: {
            name: string;
            isActive: boolean;
            id: string;
            sku: string;
            price: Decimal | null;
            stock: number;
            productId: string;
            attributes: import("@prisma/client/runtime/library").JsonValue;
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
        price: Decimal;
        comparePrice: Decimal | null;
        costPrice: Decimal | null;
        stock: number;
        lowStockAlert: number;
        weight: Decimal | null;
        categoryId: string;
        brandId: string | null;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    findBySlug(slug: string): Promise<{
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
        variants: {
            name: string;
            isActive: boolean;
            id: string;
            sku: string;
            price: Decimal | null;
            stock: number;
            productId: string;
            attributes: import("@prisma/client/runtime/library").JsonValue;
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
        price: Decimal;
        comparePrice: Decimal | null;
        costPrice: Decimal | null;
        stock: number;
        lowStockAlert: number;
        weight: Decimal | null;
        categoryId: string;
        brandId: string | null;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
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
        price: Decimal;
        comparePrice: Decimal | null;
        costPrice: Decimal | null;
        stock: number;
        lowStockAlert: number;
        weight: Decimal | null;
        categoryId: string;
        brandId: string | null;
        isFeatured: boolean;
        metaTitle: string | null;
        metaDescription: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateStock(id: string, quantity: number, type: MovementType, notes?: string, userId?: string): Promise<{
        stock: number;
        message: string;
    }>;
    getFeatured(limit?: number): Promise<{
        name: string;
        id: string;
        sku: string;
        slug: string;
        price: Decimal;
        comparePrice: Decimal | null;
        stock: number;
        images: {
            id: string;
            url: string;
            sortOrder: number;
            productId: string;
            alt: string | null;
            isPrimary: boolean;
        }[];
    }[]>;
    getLowStock(threshold?: number): Promise<{
        category: {
            name: string;
        };
        name: string;
        id: string;
        sku: string;
        stock: number;
        lowStockAlert: number;
    }[]>;
    getRelated(productId: string, limit?: number): Promise<{
        name: string;
        id: string;
        sku: string;
        slug: string;
        price: Decimal;
        comparePrice: Decimal | null;
        images: {
            id: string;
            url: string;
            sortOrder: number;
            productId: string;
            alt: string | null;
            isPrimary: boolean;
        }[];
    }[]>;
    addImage(productId: string, imageData: {
        url: string;
        alt?: string;
        isPrimary?: boolean;
    }): Promise<{
        id: string;
        url: string;
        sortOrder: number;
        productId: string;
        alt: string | null;
        isPrimary: boolean;
    }>;
    removeImage(imageId: string): Promise<{
        message: string;
    }>;
    search(query: string): Promise<{
        name: string;
        id: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        sku: string;
        barcode: string | null;
        slug: string;
        price: Decimal;
        stock: number;
        images: {
            id: string;
            url: string;
            sortOrder: number;
            productId: string;
            alt: string | null;
            isPrimary: boolean;
        }[];
    }[]>;
}
