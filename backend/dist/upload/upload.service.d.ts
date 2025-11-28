export interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}
export declare class UploadService {
    private readonly uploadPath;
    private readonly allowedImageTypes;
    private readonly maxFileSize;
    constructor();
    uploadImage(file: UploadedFile, folder: 'products' | 'banners' | 'categories' | 'brands' | 'users'): Promise<{
        url: string;
        filename: string;
    }>;
    uploadImages(files: UploadedFile[], folder: 'products' | 'banners' | 'categories' | 'brands' | 'users'): Promise<Array<{
        url: string;
        filename: string;
    }>>;
    deleteImage(url: string): Promise<boolean>;
    private validateImage;
    getFilePath(url: string): string;
    fileExists(url: string): boolean;
}
