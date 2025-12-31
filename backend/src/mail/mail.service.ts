import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;
  private readonly fromEmail: string;
  private readonly storeName: string;
  private isConfigured: boolean = false;

  constructor(private configService: ConfigService) {
    this.fromEmail = this.configService.get<string>('SMTP_FROM') || this.configService.get<string>('MAIL_FROM') || 'noreply@akemy.com';
    this.storeName = this.configService.get<string>('STORE_NAME') || 'AKEMY';

    // Verificar configuración SMTP
    const smtpUser = this.configService.get<string>('SMTP_USER') || this.configService.get<string>('MAIL_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS') || this.configService.get<string>('MAIL_PASS');
    const smtpHost = this.configService.get<string>('SMTP_HOST') || this.configService.get<string>('MAIL_HOST') || 'smtp.gmail.com';
    const smtpPort = parseInt(this.configService.get<string>('SMTP_PORT') || this.configService.get<string>('MAIL_PORT') || '587');
    const smtpSecure = String(this.configService.get<string>('SMTP_SECURE') || this.configService.get<string>('MAIL_SECURE')) === 'true';

    this.logger.log(`🔍 Configuración SMTP detectada: Host=${smtpHost}, Port=${smtpPort}, User=${smtpUser ? '******' : 'NO DEFINIDO'}, Secure=${smtpSecure}`);

    if (!smtpUser || !smtpPass) {
      this.logger.warn('⚠️ SMTP no configurado: SMTP_USER y SMTP_PASS son requeridos para enviar emails');
      this.isConfigured = false;
    } else {
      this.isConfigured = true;
      this.logger.log(`📧 SMTP configurado correctamente para: ${smtpUser}`);
    }

    // Configurar transporter
    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Verificar conexión SMTP al inicio (async)
    if (this.isConfigured) {
      this.transporter.verify()
        .then(() => {
          this.logger.log('✅ Conexión SMTP verificada correctamente y lista para enviar correos');
        })
        .catch((error) => {
          this.logger.error(`❌ Error CRÍTICO de conexión SMTP: ${error.message}`);
          this.logger.error(`👉 Verifica que el usuario y la contraseña (o App Password) sean correctos.`);
          this.isConfigured = false;
        });
    }
  }

  private async sendMail(options: MailOptions): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn(`⚠️ No se puede enviar email a ${options.to} - SMTP no configurado`);
      // En desarrollo, simular que el email fue enviado
      if (process.env.NODE_ENV === 'development') {
        this.logger.log(`📧 [DEV] Email simulado a ${options.to}: ${options.subject}`);
        return true;
      }
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: `"${this.storeName}" <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      this.logger.log(`✅ Email enviado exitosamente a ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error(`❌ Error enviando email a ${options.to}: ${error.message}`);
      return false;
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verifica tu cuenta - ${this.storeName}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${this.storeName}</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Tu papelería favorita</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">¡Bienvenido a ${this.storeName}!</h2>
          
          <p>Gracias por registrarte. Para completar tu registro y comenzar a comprar, por favor verifica tu correo electrónico haciendo clic en el botón de abajo:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Verificar mi cuenta
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:<br>
            <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Este enlace expirará en 24 horas.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            Si no creaste una cuenta en ${this.storeName}, puedes ignorar este correo.
          </p>
        </div>
      </body>
      </html>
    `;

    return this.sendMail({
      to: email,
      subject: `Verifica tu cuenta - ${this.storeName}`,
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/restablecer-contrasena?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Restablecer contraseña - ${this.storeName}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${this.storeName}</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Restablecer contraseña</h2>
          
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no realizaste esta solicitud, puedes ignorar este correo.</p>
          
          <p>Para restablecer tu contraseña, haz clic en el botón de abajo:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Restablecer contraseña
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:<br>
            <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Este enlace expirará en 1 hora.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            Si no solicitaste restablecer tu contraseña, ignora este correo.<br>
            Tu contraseña permanecerá sin cambios.
          </p>
        </div>
      </body>
      </html>
    `;

    return this.sendMail({
      to: email,
      subject: `Restablecer contraseña - ${this.storeName}`,
      html,
    });
  }

  async sendOrderConfirmationEmail(
    email: string,
    orderData: {
      orderNumber: string;
      items: Array<{ name: string; quantity: number; price: number }>;
      subtotal: number;
      tax: number;
      shipping: number;
      total: number;
      shippingAddress: string;
    },
  ): Promise<boolean> {
    const itemsHtml = orderData.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">S/ ${item.price.toFixed(2)}</td>
        </tr>
      `,
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmación de pedido - ${this.storeName}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${this.storeName}</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 48px;">✓</span>
          </div>
          
          <h2 style="color: #333; margin-top: 0; text-align: center;">¡Gracias por tu compra!</h2>
          
          <p style="text-align: center;">Tu pedido <strong>#${orderData.orderNumber}</strong> ha sido confirmado.</p>
          
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Resumen del pedido</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 10px; text-align: left;">Producto</th>
                  <th style="padding: 10px; text-align: center;">Cantidad</th>
                  <th style="padding: 10px; text-align: right;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #eee;">
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>Subtotal:</span>
                <span>S/ ${orderData.subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>IGV (18%):</span>
                <span>S/ ${orderData.tax.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                <span>Envío:</span>
                <span>S/ ${orderData.shipping.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 15px 0 0; padding-top: 10px; border-top: 1px solid #eee; font-weight: bold; font-size: 18px;">
                <span>Total:</span>
                <span style="color: #667eea;">S/ ${orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Dirección de envío</h3>
            <p style="margin: 0; color: #666;">${orderData.shippingAddress}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/mis-pedidos" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Ver mis pedidos
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            Si tienes alguna pregunta sobre tu pedido, contáctanos en<br>
            <a href="mailto:soporte@akemy.com" style="color: #667eea;">soporte@akemy.com</a>
          </p>
        </div>
      </body>
      </html>
    `;

    return this.sendMail({
      to: email,
      subject: `Pedido confirmado #${orderData.orderNumber} - ${this.storeName}`,
      html,
    });
  }

  async sendOrderStatusUpdateEmail(
    email: string,
    orderNumber: string,
    status: string,
    statusMessage: string,
  ): Promise<boolean> {
    const statusColors: Record<string, string> = {
      PAID: '#28a745',
      PREPARING: '#ffc107',
      SHIPPED: '#17a2b8',
      DELIVERED: '#28a745',
      CANCELLED: '#dc3545',
    };

    const statusEmojis: Record<string, string> = {
      PAID: '💳',
      PREPARING: '📦',
      SHIPPED: '🚚',
      DELIVERED: '✅',
      CANCELLED: '❌',
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Actualización de pedido - ${this.storeName}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${this.storeName}</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 48px;">${statusEmojis[status] || '📋'}</span>
          </div>
          
          <h2 style="color: #333; margin-top: 0; text-align: center;">Actualización de tu pedido</h2>
          
          <p style="text-align: center;">
            Tu pedido <strong>#${orderNumber}</strong> ha sido actualizado:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
            <span style="background: ${statusColors[status] || '#667eea'}; color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold;">
              ${statusMessage}
            </span>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/mis-pedidos" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Ver detalles del pedido
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            Si tienes alguna pregunta sobre tu pedido, contáctanos en<br>
            <a href="mailto:soporte@akemy.com" style="color: #667eea;">soporte@akemy.com</a>
          </p>
        </div>
      </body>
      </html>
    `;

    return this.sendMail({
      to: email,
      subject: `Actualización del pedido #${orderNumber} - ${this.storeName}`,
      html,
    });
  }
}
