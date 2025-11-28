import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAllPublic(): Promise<({
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
    findAll(includeInactive?: boolean): Promise<({
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
    findAllFlat(includeInactive?: boolean): Promise<({
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
    toggleActive(id: string): Promise<{
        isActive: boolean;
        id: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
