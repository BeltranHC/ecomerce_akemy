import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
export declare class BannersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createBannerDto: CreateBannerDto): Promise<{
        title: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        startDate: Date | null;
        endDate: Date | null;
        link: string | null;
        subtitle: string | null;
        imageUrl: string;
    }>;
    findAll(params?: {
        includeInactive?: boolean;
    }): Promise<{
        title: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        startDate: Date | null;
        endDate: Date | null;
        link: string | null;
        subtitle: string | null;
        imageUrl: string;
    }[]>;
    findOne(id: string): Promise<{
        title: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        startDate: Date | null;
        endDate: Date | null;
        link: string | null;
        subtitle: string | null;
        imageUrl: string;
    }>;
    update(id: string, updateBannerDto: UpdateBannerDto): Promise<{
        title: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        startDate: Date | null;
        endDate: Date | null;
        link: string | null;
        subtitle: string | null;
        imageUrl: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    toggleActive(id: string): Promise<{
        title: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        startDate: Date | null;
        endDate: Date | null;
        link: string | null;
        subtitle: string | null;
        imageUrl: string;
    }>;
    getActiveBanners(): Promise<{
        title: string;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        startDate: Date | null;
        endDate: Date | null;
        link: string | null;
        subtitle: string | null;
        imageUrl: string;
    }[]>;
}
