import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadProductImage(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    uploadProductImages(files: Express.Multer.File[]): Promise<{
        url: string;
        filename: string;
    }[]>;
    uploadBannerImage(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    uploadCategoryImage(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    uploadBrandImage(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
    }>;
    deleteImage(folder: string, filename: string): Promise<{
        message: string;
    }>;
}
