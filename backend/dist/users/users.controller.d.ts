import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    updateMyProfile(userId: string, updateUserDto: UpdateUserDto): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        isActive: boolean;
        id: string;
        updatedAt: Date;
    }>;
    getMyProfile(userId: string): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        isActive: boolean;
        id: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
        addresses: {
            number: string;
            phone: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            reference: string | null;
            city: string;
            district: string;
            postalCode: string | null;
            label: string;
            recipientName: string;
            street: string;
            apartment: string | null;
            province: string;
            department: string;
            isDefault: boolean;
        }[];
        _count: {
            orders: number;
        };
    }>;
    create(createUserDto: CreateUserDto): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        isActive: boolean;
        id: string;
        createdAt: Date;
    }>;
    findAll(page?: number, limit?: number, search?: string, role?: UserRole, isActive?: boolean): Promise<{
        data: {
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            isVerified: boolean;
            isActive: boolean;
            id: string;
            lastLogin: Date | null;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getCustomers(page?: number, limit?: number, search?: string): Promise<{
        data: {
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            isVerified: boolean;
            isActive: boolean;
            id: string;
            lastLogin: Date | null;
            createdAt: Date;
            orders: {
                id: string;
                createdAt: Date;
                total: import("@prisma/client/runtime/library").Decimal;
                orderNumber: string;
                status: import(".prisma/client").$Enums.OrderStatus;
            }[];
            _count: {
                orders: number;
            };
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        isActive: boolean;
        id: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
        addresses: {
            number: string;
            phone: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            reference: string | null;
            city: string;
            district: string;
            postalCode: string | null;
            label: string;
            recipientName: string;
            street: string;
            apartment: string | null;
            province: string;
            department: string;
            isDefault: boolean;
        }[];
        _count: {
            orders: number;
        };
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        isActive: boolean;
        id: string;
        updatedAt: Date;
    }>;
    toggleActive(id: string): Promise<{
        isActive: boolean;
        id: string;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
