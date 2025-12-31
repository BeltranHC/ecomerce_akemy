import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) { }

  // Registro de cliente
  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email.toLowerCase() },
    });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email.toLowerCase(),
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone || null,
        role: UserRole.CUSTOMER,
        isVerified: false, // Requiere verificación de correo
      },
    });

    // Crear token de verificación
    const verificationToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 horas

    await this.prisma.verificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Enviar email de verificación
    await this.mailService.sendVerificationEmail(user.email, verificationToken);

    // Log de auditoría
    await this.createAuditLog(user.id, 'CREATE', 'User', user.id);

    return {
      message: 'Registro exitoso. Por favor, revisa tu correo electrónico para verificar tu cuenta.',
      userId: user.id,
    };
  }

  // Verificar correo electrónico
  async verifyEmail(token: string) {
    const verificationToken = await this.prisma.verificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      throw new BadRequestException('Token de verificación inválido');
    }

    if (verificationToken.expiresAt < new Date()) {
      throw new BadRequestException('El token de verificación ha expirado');
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

  // Login de cliente
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    // Verificar que el correo esté verificado
    if (!user.isVerified) {
      throw new UnauthorizedException('Por favor, verifica tu correo electrónico antes de iniciar sesión. Revisa tu bandeja de entrada.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tu cuenta ha sido desactivada');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Actualizar refresh token y último login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: await bcrypt.hash(tokens.refreshToken, 10),
        lastLogin: new Date(),
      },
    });

    // Log de auditoría
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

  // Login de administrador
  async adminLogin(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const adminRoles: UserRole[] = [UserRole.ADMIN, UserRole.SUPERADMIN, UserRole.EDITOR, UserRole.PRODUCT_MANAGER];

    if (!adminRoles.includes(user.role)) {
      throw new UnauthorizedException('No tienes permisos de administrador');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Tu cuenta ha sido desactivada');
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

  // Validar usuario
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }

  // Generar tokens
  async generateTokens(userId: string, email: string, role: UserRole) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '15m',
    };
  }

  // Refrescar token
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Acceso denegado');
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Token de refresco inválido');
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

  // Cerrar sesión
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    await this.createAuditLog(userId, 'LOGOUT', 'User', userId);

    return { message: 'Sesión cerrada exitosamente' };
  }

  // Solicitar recuperación de contraseña
  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // No revelar si el correo existe o no
    if (!user) {
      return { message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña' };
    }

    // Invalidar tokens anteriores
    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const resetToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hora

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

  // Restablecer contraseña
  async resetPassword(token: string, newPassword: string) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.used) {
      throw new BadRequestException('Token de recuperación inválido');
    }

    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException('El token de recuperación ha expirado');
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

  // Cambiar contraseña (usuario autenticado)
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('La contraseña actual es incorrecta');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await this.createAuditLog(userId, 'PASSWORD_CHANGE', 'User', userId);

    return { message: 'Contraseña actualizada exitosamente' };
  }

  // Reenviar email de verificación
  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // No revelar si el correo existe o no por seguridad
    if (!user) {
      return { message: 'Si el correo existe, recibirás un enlace de verificación' };
    }

    if (user.isVerified) {
      throw new BadRequestException('El correo ya está verificado. Puedes iniciar sesión.');
    }

    // Eliminar tokens anteriores
    await this.prisma.verificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Crear nuevo token
    const verificationToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 horas

    await this.prisma.verificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Enviar email de verificación
    await this.mailService.sendVerificationEmail(user.email, verificationToken);

    return { message: 'Si el correo existe, recibirás un enlace de verificación' };
  }

  // Crear log de auditoría
  private async createAuditLog(
    userId: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'PASSWORD_CHANGE' | 'STATUS_CHANGE',
    entity: string,
    entityId?: string,
    oldValues?: any,
    newValues?: any,
  ) {
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
}
