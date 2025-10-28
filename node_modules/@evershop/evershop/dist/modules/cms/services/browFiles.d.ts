export interface FileBrowser {
    name: string;
    url: string;
}
/**
 * @param {String} path the file path
 */
export declare const browFiles: (path: string) => Promise<{
    files: FileBrowser[];
    folders: string[];
}>;
