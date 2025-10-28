import { FileBrowser } from './browFiles.js';
export interface UploadedFile extends FileBrowser {
    mimetype: string;
    size: number;
    url: string;
}
/**
 * Upload files to the specified destination path.
 * @param {Array} files an array of files in the format of {name: String, data: Buffer}
 * @param {String} destinationPath the destination path
 */
export declare const uploadFile: (files: Express.Multer.File[], destinationPath: string) => Promise<UploadedFile[]>;
