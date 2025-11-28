import { ProductStatus } from '@prisma/client';
export declare class CreateProductDto {
    sku: string;
    barcode?: string;
    name: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    price: number;
    comparePrice?: number;
    costPrice?: number;
    stock?: number;
    lowStockAlert?: number;
    weight?: number;
    categoryId: string;
    brandId?: string;
    status?: ProductStatus;
    isFeatured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
}
