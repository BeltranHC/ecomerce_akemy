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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const uuid_1 = require("uuid");
const prisma_service_1 = require("../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
const mail_service_1 = require("../mail/mail.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, usersService, jwtService, configService, mailService) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.mailService = mailService;
    }
    async register(registerDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email.toLowerCase() },
        });
        if (existingUser) {
            throw new common_1.ConflictException('El correo electrónico ya está registrado');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email.toLowerCase(),
                password: hashedPassword,
                firstName: registerDto.firstName,
                lastName: registerDto.lastName,
                phone: registerDto.phone,
                role: client_1.UserRole.CUSTOMER,
            },
        });
        const verificationToken = (0, uuid_1.v4)();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        await this.prisma.verificationToken.create({
            data: {
                token: verificationToken,
                userId: user.id,
                expiresAt,
            },
        });
        await this.mailService.sendVerificationEmail(user.email, verificationToken);
        await this.createAuditLog(user.id, 'CREATE', 'User', user.id);
        return {
            message: 'Registro exitoso. Por favor, verifica tu correo electrónico.',
            userId: user.id,
        };
    }
    async verifyEmail(token) {
        const verificationToken = await this.prisma.verificationToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!verificationToken) {
            throw new common_1.BadRequestException('Token de verificación inválido');
        }
        if (verificationToken.expiresAt < new Date()) {
            throw new common_1.BadRequestException('El token de verificación ha expirado');
        }
        await this.prisma.user.update({
            where: { id: verificationToken.userId },
            data: { isVerified: true },
        });
        await this.prisma.verificationToken.delete({
            where: { id: verificationToken.id },
        });
        return { message: 'Correo verificado exitosamente. Ya puedes iniciar sesión.' };
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user.isVerified) {
            throw new common_1.UnauthorizedException('Por favor, verifica tu correo electrónico antes de iniciar sesión');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Tu cuenta ha sido desactivada');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
                lastLogin: new Date(),
            },
        });
        await this.createAuditLog(user.id, 'LOGIN', 'User', user.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
            },
            ...tokens,
        };
    }
    async adminLogin(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        const adminRoles = [client_1.UserRole.ADMIN, client_1.UserRole.SUPERADMIN, client_1.UserRole.EDITOR, client_1.UserRole.PRODUCT_MANAGER];
        if (!adminRoles.includes(user.role)) {
            throw new common_1.UnauthorizedException('No tienes permisos de administrador');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Tu cuenta ha sido desactivada');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
                lastLogin: new Date(),
            },
        });
        await this.createAuditLog(user.id, 'LOGIN', 'Admin', user.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
            },
            ...tokens,
        };
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        return user;
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRATION') || '15m',
            }),
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
            }),
        ]);
        return {
            accessToken,
            refreshToken,
            expiresIn: this.configService.get('JWT_EXPIRATION') || '15m',
        };
    }
    async refreshTokens(userId, refreshToken) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.refreshToken) {
            throw new common_1.UnauthorizedException('Acceso denegado');
        }
        const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!isRefreshTokenValid) {
            throw new common_1.UnauthorizedException('Token de refresco inválido');
        }
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
            },
        });
        return tokens;
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { refreshToken: null },
        });
        await this.createAuditLog(userId, 'LOGOUT', 'User', userId);
        return { message: 'Sesión cerrada exitosamente' };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user) {
            return { message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña' };
        }
        await this.prisma.passwordResetToken.updateMany({
            where: { userId: user.id, used: false },
            data: { used: true },
        });
        const resetToken = (0, uuid_1.v4)();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        await this.prisma.passwordResetToken.create({
            data: {
                token: resetToken,
                userId: user.id,
                expiresAt,
            },
        });
        await this.mailService.sendPasswordResetEmail(user.email, resetToken);
        return { message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña' };
    }
    async resetPassword(token, newPassword) {
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!resetToken || resetToken.used) {
            throw new common_1.BadRequestException('Token de recuperación inválido');
        }
        if (resetToken.expiresAt < new Date()) {
            throw new common_1.BadRequestException('El token de recuperación ha expirado');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: resetToken.userId },
            data: { password: hashedPassword },
        });
        await this.prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { used: true },
        });
        await this.createAuditLog(resetToken.userId, 'PASSWORD_CHANGE', 'User', resetToken.userId);
        return { message: 'Contraseña restablecida exitosamente' };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('La contraseña actual es incorrecta');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        await this.createAuditLog(userId, 'PASSWORD_CHANGE', 'User', userId);
        return { message: 'Contraseña actualizada exitosamente' };
    }
    async createAuditLog(userId, action, entity, entityId, oldValues, newValues) {
        await this.prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                oldValues,
                newValues,
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map