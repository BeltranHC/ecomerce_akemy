import { UserRole } from '@prisma/client';
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
    isVerified?: boolean;
    isActive?: boolean;
}
