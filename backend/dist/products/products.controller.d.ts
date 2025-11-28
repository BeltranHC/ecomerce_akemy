import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { ProductStatus } from '@prisma/client';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAllPublished(page?: string, limit?: string, search?: string, categorySlug?: string, brandSlug?: string, minPrice?: string, maxPrice?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
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
            price: import("@prisma/client/runtime/library").Decimal;
            comparePrice: import("@prisma/client/runtime/library").Decimal | null;
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
    getFeatured(limit?: string): Promise<{
        name: string;
        id: string;
        sku: string;
        slug: string;
        price: import("@prisma/client/runtime/library").Decimal;
        comparePrice: import("@prisma/client/runtime/library").Decimal | null;
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
    search(query: string): Promise<{
        name: string;
        id: string;
        status: import(".prisma/client").$Enums.ProductStatus;
        sku: string;
        barcode: string | null;
        slug: string;
        price: import("@prisma/client/runtime/library").Decimal;
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
            price: import("@prisma/client/runtime/library").Decimal | null;
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
    }>;
    getRelated(id: string, limit?: string): Promise<{
        name: string;
        id: string;
        sku: string;
        slug: string;
        price: import("@prisma/client/runtime/library").Decimal;
        comparePrice: import("@prisma/client/runtime/library").Decimal | null;
        images: {
            id: string;
            url: string;
            sortOrder: number;
            productId: string;
            alt: string | null;
            isPrimary: boolean;
        }[];
    }[]>;
    create(createProductDto: CreateProductDto, userId: string): Promise<{
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
    }>;
    findAll(page?: string, limit?: string, search?: string, categoryId?: string, brandId?: string, status?: ProductStatus, isFeatured?: string, inStock?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
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
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getLowStock(threshold?: string): Promise<{
        category: {
            name: string;
        };
        name: string;
        id: string;
        sku: string;
        stock: number;
        lowStockAlert: number;
    }[]>;
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
            price: import("@prisma/client/runtime/library").Decimal | null;
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
    }>;
    updateStock(id: string, updateStockDto: UpdateStockDto, userId: string): Promise<{
        stock: number;
        message: string;
    }>;
    addImage(id: string, imageData: {
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
    remove(id: string): Promise<{
        message: string;
    }>;
}
