import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';
export declare class AuthService {
    private prisma;
    private usersService;
    private jwtService;
    private configService;
    private mailService;
    constructor(prisma: PrismaService, usersService: UsersService, jwtService: JwtService, configService: ConfigService, mailService: MailService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    adminLogin(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
    validateUser(email: string, password: string): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phone: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        isVerified: boolean;
        isActive: boolean;
        id: string;
        lastLogin: Date | null;
        refreshToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    generateTokens(userId: string, email: string, role: UserRole): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
    }>;
    refreshTokens(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    private createAuditLog;
}
