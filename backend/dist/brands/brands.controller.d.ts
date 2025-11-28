import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsController {
    private readonly brandsService;
    constructor(brandsService: BrandsService);
    findAllPublic(): Promise<({
        _count: {
            products: number;
        };
    } & {
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logo: string | null;
    })[]>;
    findBySlug(slug: string): Promise<{
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logo: string | null;
    }>;
    create(createBrandDto: CreateBrandDto): Promise<{
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logo: string | null;
    }>;
    findAll(includeInactive?: boolean): Promise<({
        _count: {
            products: number;
        };
    } & {
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logo: string | null;
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            products: number;
        };
    } & {
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logo: string | null;
    }>;
    update(id: string, updateBrandDto: UpdateBrandDto): Promise<{
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logo: string | null;
    }>;
    toggleActive(id: string): Promise<{
        name: string;
        description: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        logo: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
