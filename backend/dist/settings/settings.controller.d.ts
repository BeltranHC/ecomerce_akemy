import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublicSettings(): Promise<any>;
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
}
