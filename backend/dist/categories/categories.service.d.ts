import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        parent: {
            name: string;
            id: string;
            slug: string;
        } | null;
    } & {
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
    }>;
    findAll(params?: {
        includeInactive?: boolean;
    }): Promise<({
        _count: {
            products: number;
        };
        children: {
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
        }[];
    } & {
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
    })[]>;
    findAllFlat(params?: {
        includeInactive?: boolean;
    }): Promise<({
        _count: {
            products: number;
        };
        parent: {
            name: string;
            id: string;
            slug: string;
        } | null;
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            products: number;
        };
        parent: {
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
        } | null;
        children: {
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
        }[];
    } & {
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
    }>;
    findBySlug(slug: string): Promise<{
        parent: {
            name: string;
            id: string;
            slug: string;
        } | null;
        children: {
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
        }[];
    } & {
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
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        parent: {
            name: string;
            id: string;
            slug: string;
        } | null;
    } & {
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    toggleActive(id: string): Promise<{
        isActive: boolean;
        id: string;
    }>;
    getMainCategories(): Promise<{
        name: string;
        id: string;
        slug: string;
        image: string | null;
        children: {
            name: string;
            id: string;
            slug: string;
        }[];
    }[]>;
}
