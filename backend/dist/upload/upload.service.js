"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const uuid_1 = require("uuid");
let UploadService = class UploadService {
    constructor() {
        this.uploadPath = (0, path_1.join)(process.cwd(), 'uploads');
        this.allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        this.maxFileSize = 5 * 1024 * 1024;
        if (!(0, fs_1.existsSync)(this.uploadPath)) {
            (0, fs_1.mkdirSync)(this.uploadPath, { recursive: true });
        }
        const subdirs = ['products', 'banners', 'categories', 'brands', 'users'];
        subdirs.forEach((dir) => {
            const path = (0, path_1.join)(this.uploadPath, dir);
            if (!(0, fs_1.existsSync)(path)) {
                (0, fs_1.mkdirSync)(path, { recursive: true });
            }
        });
    }
    async uploadImage(file, folder) {
        this.validateImage(file);
        const ext = (0, path_1.extname)(file.originalname).toLowerCase();
        const filename = `${(0, uuid_1.v4)()}${ext}`;
        const filePath = (0, path_1.join)(this.uploadPath, folder, filename);
        (0, fs_1.writeFileSync)(filePath, file.buffer);
        const url = `/uploads/${folder}/${filename}`;
        return { url, filename };
    }
    async uploadImages(files, folder) {
        const results = [];
        for (const file of files) {
            const result = await this.uploadImage(file, folder);
            results.push(result);
        }
        return results;
    }
    async deleteImage(url) {
        try {
            const relativePath = url.replace('/uploads/', '');
            const filePath = (0, path_1.join)(this.uploadPath, relativePath);
            if ((0, fs_1.existsSync)(filePath)) {
                (0, fs_1.unlinkSync)(filePath);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Error al eliminar imagen:', error);
            return false;
        }
    }
    validateImage(file) {
        if (!this.allowedImageTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Tipo de archivo no permitido. Solo se aceptan: ${this.allowedImageTypes.join(', ')}`);
        }
        if (file.size > this.maxFileSize) {
            throw new common_1.BadRequestException(`El archivo es muy grande. Tamaño máximo: ${this.maxFileSize / 1024 / 1024}MB`);
        }
    }
    getFilePath(url) {
        const relativePath = url.replace('/uploads/', '');
        return (0, path_1.join)(this.uploadPath, relativePath);
    }
    fileExists(url) {
        const filePath = this.getFilePath(url);
        return (0, fs_1.existsSync)(filePath);
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UploadService);
//# sourceMappingURL=upload.service.js.map