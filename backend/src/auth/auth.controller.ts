import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'El correo ya está registrado' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('verify/:token')
  @ApiOperation({ summary: 'Verificar correo electrónico' })
  @ApiResponse({ status: 200, description: 'Correo verificado exitosamente' })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  async verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Get('test-mail')
  @ApiOperation({ summary: 'Test de envío de correo (DEBUG DIRECTO)' })
  async testMail() {
    // Importar nodemailer directamente
    const nodemailer = require('nodemailer');

    const config = {
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT || '587'),
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
      from: process.env.MAIL_FROM,
    };

    const diagnostics = {
      config: {
        host: config.host,
        port: config.port,
        user: config.user ? 'SET' : 'MISSING',
        pass: config.pass ? `SET (${config.pass.length} chars)` : 'MISSING',
        from: config.from,
      },
      steps: [] as string[],
      result: null as any,
      error: null as any,
    };

    try {
      diagnostics.steps.push('1. Creating transporter...');
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: false,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });

      diagnostics.steps.push('2. Verifying connection...');
      await transporter.verify();
      diagnostics.steps.push('2. ✓ Connection verified!');

      diagnostics.steps.push('3. Sending test email...');
      const info = await transporter.sendMail({
        from: `"AKEMY Test" <${config.from}>`,
        to: config.user, // Enviar al mismo correo
        subject: 'Test desde Render - ' + new Date().toISOString(),
        html: '<h1>¡Funciona!</h1><p>Este correo fue enviado desde el servidor de Render.</p>',
      });

      diagnostics.steps.push('3. ✓ Email sent!');
      diagnostics.result = {
        success: true,
        messageId: info.messageId,
        response: info.response,
      };
    } catch (error) {
      diagnostics.steps.push(`❌ Error: ${error.message}`);
      diagnostics.error = {
        message: error.message,
        code: error.code,
      };
    }

    return diagnostics;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión de cliente' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión de administrador' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas o sin permisos' })
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar tokens de acceso' })
  @ApiBearerAuth()
  async refreshTokens(@Req() req: any) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión' })
  async logout(@Req() req: any) {
    return this.authService.logout(req.user.sub);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restablecer contraseña' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.password);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reenviar correo de verificación' })
  @ApiResponse({ status: 200, description: 'Correo de verificación reenviado' })
  async resendVerificationEmail(@Body() body: { email: string }) {
    return this.authService.resendVerificationEmail(body.email);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña' })
  async changePassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(
      req.user.sub,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  async getProfile(@Req() req: any) {
    return req.user;
  }
}
