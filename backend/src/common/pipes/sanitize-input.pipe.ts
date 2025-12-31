import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizeInputPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (typeof value === 'string') {
            return this.sanitize(value);
        }

        if (typeof value === 'object' && value !== null) {
            return this.sanitizeObject(value);
        }

        return value;
    }

    private sanitize(input: string): string {
        // Remover HTML tags y scripts maliciosos
        return sanitizeHtml(input, {
            allowedTags: [], // No permitir tags HTML
            allowedAttributes: {},
            disallowedTagsMode: 'discard',
        }).trim();
    }

    private sanitizeObject(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(item => this.transform(item, {} as ArgumentMetadata));
        }

        const sanitized: Record<string, any> = {};
        for (const key of Object.keys(obj)) {
            const value = obj[key];
            // Campos que no deben sanitizarse (contraseñas, tokens, etc.)
            const skipFields = ['password', 'token', 'refreshToken', 'accessToken'];
            if (skipFields.includes(key)) {
                sanitized[key] = value;
            } else {
                sanitized[key] = this.transform(value, {} as ArgumentMetadata);
            }
        }
        return sanitized;
    }
}
