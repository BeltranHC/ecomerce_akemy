import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
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
    findAll(includeInactive?: boolean): Promise<{
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
    remove(id: string): Promise<{
        message: string;
    }>;
}
