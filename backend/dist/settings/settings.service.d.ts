import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        group: string;
        key: string;
    }[]>;
    findByGroup(group: string): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        group: string;
        key: string;
    }[]>;
    findByKey(key: string): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        group: string;
        key: string;
    }>;
    getValue(key: string): Promise<string | null>;
    update(key: string, updateDto: UpdateSettingDto): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        group: string;
        key: string;
    }>;
    updateMany(settings: {
        key: string;
        value: string;
    }[]): Promise<{
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        value: string;
        group: string;
        key: string;
    }[]>;
    getPublicSettings(): Promise<any>;
}
