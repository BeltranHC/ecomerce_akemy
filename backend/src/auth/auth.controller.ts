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
  @ApiOperation({ summary: 'Test de envío de correo (DEBUG)' })
  async testMail() {
    // Diagnóstico completo de configuración SMTP
    const diagnostics = {
      env: {
        MAIL_HOST: process.env.MAIL_HOST || 'NO DEFINIDO',
        MAIL_PORT: process.env.MAIL_PORT || 'NO DEFINIDO',
        MAIL_USER: process.env.MAIL_USER ? '✓ DEFINIDO' : '✗ NO DEFINIDO',
        MAIL_PASS: process.env.MAIL_PASS ? `✓ DEFINIDO (${process.env.MAIL_PASS.length} chars)` : '✗ NO DEFINIDO',
        MAIL_FROM: process.env.MAIL_FROM || 'NO DEFINIDO',
        SMTP_HOST: process.env.SMTP_HOST || 'NO DEFINIDO',
        SMTP_USER: process.env.SMTP_USER ? '✓ DEFINIDO' : '✗ NO DEFINIDO',
        SMTP_PASS: process.env.SMTP_PASS ? `✓ DEFINIDO (${process.env.SMTP_PASS.length} chars)` : '✗ NO DEFINIDO',
      },
      timestamp: new Date().toISOString(),
      testResult: null as any,
      error: null as any,
    };

    try {
      const result = await this.authService['mailService'].sendVerificationEmail('huaraya0804@gmail.com', 'TEST-TOKEN-123');
      diagnostics.testResult = {
        success: result,
        message: result ? 'Correo enviado correctamente' : 'Falló el envío - MailService.isConfigured es false'
      };
    } catch (error) {
      diagnostics.error = {
        message: error.message,
        stack: error.stack?.split('\n').slice(0, 3).join('\n')
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
