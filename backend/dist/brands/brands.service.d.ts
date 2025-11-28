import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findAll(params?: {
        includeInactive?: boolean;
    }): Promise<({
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
    remove(id: string): Promise<{
        message: string;
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
}
