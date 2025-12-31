import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
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
  private resend: Resend | null = null;
  private transporter: Transporter | null = null;
  private fromEmail: string;
  private readonly storeName: string;
  private useResend: boolean = false;
  private isConfigured: boolean = false;

  constructor() {
    this.storeName = process.env.STORE_NAME || 'AKEMY';
    this.fromEmail = process.env.MAIL_FROM || 'onboarding@resend.dev';

    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      this.resend = new Resend(resendApiKey);
      this.useResend = true;
      this.isConfigured = true;
      this.fromEmail = process.env.MAIL_FROM || 'noreply@akemy.app';
      this.logger.log(`📧 Email configurado con Resend (from: ${this.fromEmail})`);
    } else {
      const smtpUser = process.env.SMTP_USER || process.env.MAIL_USER;
      const smtpPass = process.env.SMTP_PASS || process.env.MAIL_PASS;
      const smtpHost = process.env.SMTP_HOST || process.env.MAIL_HOST || 'smtp.gmail.com';
      const smtpPort = parseInt(process.env.SMTP_PORT || process.env.MAIL_PORT || '587');

      if (smtpUser && smtpPass) {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: false,
          auth: { user: smtpUser, pass: smtpPass },
        });
        this.isConfigured = true;
        this.logger.log(`📧 Email configurado con SMTP: ${smtpHost}`);
      } else {
        this.logger.warn('⚠️ Email no configurado: falta RESEND_API_KEY o credenciales SMTP');
      }
    }
  }

  // Base template with enhanced design
  private getEmailTemplate(content: string, preheader?: string): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>${this.storeName}</title>
        <!--[if mso]>
        <style type="text/css">
          table { border-collapse: collapse; }
        </style>
        <![endif]-->
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        ${preheader ? `<div style="display: none; max-height: 0; overflow: hidden;">${preheader}</div>` : ''}
        
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f7;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <!-- Email Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.03);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center">
                          <!-- Logo Area -->
                          <div style="width: 70px; height: 70px; background: rgba(255,255,255,0.2); border-radius: 50%; display: inline-block; margin-bottom: 15px; line-height: 70px;">
                            <span style="font-size: 32px; color: white; font-weight: bold;">A</span>
                          </div>
                          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${this.storeName}</h1>
                          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px; font-weight: 500;">Tu papelería favorita ✨</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 35px;">
                    ${content}
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #f8f9fc; padding: 30px; border-radius: 0 0 16px 16px; border-top: 1px solid #eef0f5;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center">
                          <!-- Social Icons -->
                          <div style="margin-bottom: 20px;">
                            <a href="#" style="display: inline-block; margin: 0 8px; width: 36px; height: 36px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none;">
                              <span style="color: white; font-size: 16px;">f</span>
                            </a>
                            <a href="#" style="display: inline-block; margin: 0 8px; width: 36px; height: 36px; background: linear-gradient(135deg, #f093fb, #f5576c); border-radius: 50%; text-align: center; line-height: 36px; text-decoration: none;">
                              <span style="color: white; font-size: 16px;">✦</span>
                            </a>
                          </div>
                          
                          <p style="color: #667eea; font-size: 14px; font-weight: 600; margin: 0 0 5px;">${this.storeName}</p>
                          <p style="color: #8c8c9a; font-size: 12px; margin: 0 0 15px;">Tu papelería favorita en Perú</p>
                          
                          <p style="color: #a0a0aa; font-size: 11px; margin: 0;">
                            © ${new Date().getFullYear()} ${this.storeName}. Todos los derechos reservados.<br>
                            <a href="https://akemy.app" style="color: #667eea; text-decoration: none;">akemy.app</a>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }

  private getButton(text: string, url: string, emoji?: string): string {
    return `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center" style="padding: 25px 0;">
            <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s;">
              ${emoji ? emoji + ' ' : ''}${text}
            </a>
          </td>
        </tr>
      </table>
    `;
  }

  private async sendMail(options: MailOptions): Promise<boolean> {
    if (!this.isConfigured) {
      this.logger.warn(`⚠️ No se puede enviar email a ${options.to} - servicio no configurado`);
      return false;
    }

    try {
      if (this.useResend && this.resend) {
        const { data, error } = await this.resend.emails.send({
          from: `${this.storeName} <${this.fromEmail}>`,
          to: [options.to],
          subject: options.subject,
          html: options.html,
        });

        if (error) {
          this.logger.error(`❌ Error Resend: ${error.message}`);
          return false;
        }

        this.logger.log(`✅ Email enviado via Resend a ${options.to} (ID: ${data?.id})`);
        return true;
      } else if (this.transporter) {
        await this.transporter.sendMail({
          from: `"${this.storeName}" <${this.fromEmail}>`,
          to: options.to,
          subject: options.subject,
          html: options.html,
        });
        this.logger.log(`✅ Email enviado via SMTP a ${options.to}`);
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(`❌ Error enviando email a ${options.to}: ${error.message}`);
      return false;
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verificar-email?token=${token}`;

    const content = `
      <div style="text-align: center; margin-bottom: 25px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea20, #764ba220); border-radius: 50%; display: inline-block; margin-bottom: 20px;">
          <span style="font-size: 40px; line-height: 80px;">🎉</span>
        </div>
        <h2 style="color: #1a1a2e; margin: 0 0 10px; font-size: 26px; font-weight: 700;">¡Bienvenido a ${this.storeName}!</h2>
        <p style="color: #6b7280; margin: 0; font-size: 15px;">Estamos emocionados de tenerte con nosotros</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #f8f9fc, #eef2ff); border-radius: 12px; padding: 25px; margin: 25px 0;">
        <p style="color: #374151; margin: 0; font-size: 15px; line-height: 1.7;">
          Para completar tu registro y empezar a disfrutar de las mejores ofertas en artículos de papelería, 
          por favor verifica tu correo electrónico haciendo clic en el botón:
        </p>
      </div>

      ${this.getButton('Verificar mi cuenta', verificationUrl, '✨')}

      <div style="background: #fff8e6; border-left: 4px solid #f59e0b; border-radius: 0 8px 8px 0; padding: 15px 20px; margin: 25px 0;">
        <p style="color: #92400e; margin: 0; font-size: 13px;">
          <strong>⏰ Importante:</strong> Este enlace expirará en 24 horas.
        </p>
      </div>

      <p style="color: #9ca3af; font-size: 12px; margin: 20px 0 0; line-height: 1.6;">
        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
        <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
      </p>
    `;

    return this.sendMail({
      to: email,
      subject: `🎉 ¡Bienvenido a ${this.storeName}! Verifica tu cuenta`,
      html: this.getEmailTemplate(content, 'Verifica tu cuenta para comenzar a comprar'),
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/restablecer-contrasena?token=${token}`;

    const content = `
      <div style="text-align: center; margin-bottom: 25px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #fef3c720, #f59e0b20); border-radius: 50%; display: inline-block; margin-bottom: 20px;">
          <span style="font-size: 40px; line-height: 80px;">🔐</span>
        </div>
        <h2 style="color: #1a1a2e; margin: 0 0 10px; font-size: 26px; font-weight: 700;">Restablecer contraseña</h2>
        <p style="color: #6b7280; margin: 0; font-size: 15px;">Recibimos tu solicitud</p>
      </div>
      
      <div style="background: #f8f9fc; border-radius: 12px; padding: 25px; margin: 25px 0;">
        <p style="color: #374151; margin: 0; font-size: 15px; line-height: 1.7;">
          Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. 
          Si no realizaste esta solicitud, puedes ignorar este correo de forma segura.
        </p>
      </div>

      ${this.getButton('Restablecer contraseña', resetUrl, '🔑')}

      <div style="background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 0 8px 8px 0; padding: 15px 20px; margin: 25px 0;">
        <p style="color: #991b1b; margin: 0; font-size: 13px;">
          <strong>⚠️ Seguridad:</strong> Este enlace expirará en 1 hora. Nunca compartas este enlace con nadie.
        </p>
      </div>

      <p style="color: #9ca3af; font-size: 12px; margin: 20px 0 0; line-height: 1.6;">
        Si no solicitaste restablecer tu contraseña, tu cuenta permanece segura.<br>
        <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
      </p>
    `;

    return this.sendMail({
      to: email,
      subject: `🔐 Restablecer contraseña - ${this.storeName}`,
      html: this.getEmailTemplate(content, 'Solicitud para restablecer tu contraseña'),
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
          <td style="padding: 15px; border-bottom: 1px solid #f3f4f6;">
            <div style="display: flex; align-items: center;">
              <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea10, #764ba210); border-radius: 8px; margin-right: 15px; text-align: center; line-height: 50px;">
                <span style="font-size: 20px;">📦</span>
              </div>
              <div>
                <p style="margin: 0; font-weight: 600; color: #1a1a2e;">${item.name}</p>
                <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280;">Cantidad: ${item.quantity}</p>
              </div>
            </div>
          </td>
          <td style="padding: 15px; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: 600; color: #1a1a2e;">S/ ${item.price.toFixed(2)}</td>
        </tr>
      `,
      )
      .join('');

    const content = `
      <div style="text-align: center; margin-bottom: 25px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b98120, #059669); border-radius: 50%; display: inline-block; margin-bottom: 20px;">
          <span style="font-size: 40px; line-height: 80px; color: white;">✓</span>
        </div>
        <h2 style="color: #1a1a2e; margin: 0 0 10px; font-size: 26px; font-weight: 700;">¡Gracias por tu compra!</h2>
        <p style="color: #6b7280; margin: 0; font-size: 15px;">Tu pedido ha sido confirmado exitosamente</p>
      </div>

      <!-- Order Number Badge -->
      <div style="text-align: center; margin: 25px 0;">
        <div style="display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); padding: 12px 30px; border-radius: 50px;">
          <span style="color: white; font-size: 14px; font-weight: 600;">Pedido #${orderData.orderNumber}</span>
        </div>
      </div>

      <!-- Products Table -->
      <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; margin: 25px 0;">
        <div style="background: linear-gradient(135deg, #f8f9fc, #eef2ff); padding: 15px 20px; border-bottom: 1px solid #e5e7eb;">
          <h3 style="margin: 0; color: #1a1a2e; font-size: 16px; font-weight: 600;">📋 Resumen del pedido</h3>
        </div>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <!-- Totals -->
        <div style="padding: 20px; background: #f8f9fc;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
              <td style="padding: 5px 0; color: #6b7280; font-size: 14px;">Subtotal</td>
              <td style="padding: 5px 0; text-align: right; color: #374151; font-size: 14px;">S/ ${orderData.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #6b7280; font-size: 14px;">IGV (18%)</td>
              <td style="padding: 5px 0; text-align: right; color: #374151; font-size: 14px;">S/ ${orderData.tax.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #6b7280; font-size: 14px;">Envío</td>
              <td style="padding: 5px 0; text-align: right; color: #374151; font-size: 14px;">${orderData.shipping === 0 ? '<span style="color: #10b981; font-weight: 600;">GRATIS</span>' : `S/ ${orderData.shipping.toFixed(2)}`}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 15px 0 0;">
                <div style="border-top: 2px solid #e5e7eb; padding-top: 15px; display: flex; justify-content: space-between;">
                  <span style="font-size: 18px; font-weight: 700; color: #1a1a2e;">Total</span>
                  <span style="font-size: 20px; font-weight: 800; color: #667eea;">S/ ${orderData.total.toFixed(2)}</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Shipping Address -->
      <div style="background: #f8f9fc; border-radius: 12px; padding: 20px; margin: 25px 0;">
        <h3 style="margin: 0 0 12px; color: #1a1a2e; font-size: 15px; font-weight: 600;">📍 Dirección de entrega</h3>
        <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">${orderData.shippingAddress}</p>
      </div>

      ${this.getButton('Ver mis pedidos', `${process.env.FRONTEND_URL}/cuenta/pedidos`, '👀')}

      <!-- Help Section -->
      <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea10, #764ba210); border-radius: 12px; margin-top: 25px;">
        <p style="color: #667eea; font-size: 14px; font-weight: 600; margin: 0 0 5px;">¿Tienes alguna pregunta?</p>
        <p style="color: #6b7280; font-size: 13px; margin: 0;">Escríbenos a <a href="mailto:noreply@akemy.app" style="color: #667eea; text-decoration: none; font-weight: 600;">noreply@akemy.app</a></p>
      </div>
    `;

    return this.sendMail({
      to: email,
      subject: `✅ Pedido confirmado #${orderData.orderNumber} - ${this.storeName}`,
      html: this.getEmailTemplate(content, `Tu pedido #${orderData.orderNumber} ha sido confirmado`),
    });
  }

  async sendOrderStatusUpdateEmail(
    email: string,
    orderNumber: string,
    status: string,
    statusMessage: string,
  ): Promise<boolean> {
    const statusConfig: Record<string, { emoji: string; color: string; bgColor: string; title: string }> = {
      PAID: { emoji: '💳', color: '#10b981', bgColor: '#ecfdf5', title: 'Pago confirmado' },
      PREPARING: { emoji: '📦', color: '#f59e0b', bgColor: '#fffbeb', title: 'En preparación' },
      READY: { emoji: '🎉', color: '#8b5cf6', bgColor: '#f5f3ff', title: '¡Listo para recoger!' },
      SHIPPED: { emoji: '🚚', color: '#3b82f6', bgColor: '#eff6ff', title: 'En camino' },
      DELIVERED: { emoji: '✅', color: '#10b981', bgColor: '#ecfdf5', title: '¡Entregado!' },
      CANCELLED: { emoji: '❌', color: '#ef4444', bgColor: '#fef2f2', title: 'Cancelado' },
    };

    const config = statusConfig[status] || { emoji: '📋', color: '#667eea', bgColor: '#eef2ff', title: 'Actualización' };

    const content = `
      <div style="text-align: center; margin-bottom: 25px;">
        <div style="width: 80px; height: 80px; background: ${config.bgColor}; border-radius: 50%; display: inline-block; margin-bottom: 20px;">
          <span style="font-size: 40px; line-height: 80px;">${config.emoji}</span>
        </div>
        <h2 style="color: #1a1a2e; margin: 0 0 10px; font-size: 26px; font-weight: 700;">${config.title}</h2>
        <p style="color: #6b7280; margin: 0; font-size: 15px;">Pedido #${orderNumber}</p>
      </div>

      <!-- Status Badge -->
      <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; background: ${config.bgColor}; border: 2px solid ${config.color}; padding: 16px 35px; border-radius: 12px;">
          <p style="color: ${config.color}; margin: 0; font-size: 16px; font-weight: 700;">
            ${config.emoji} ${statusMessage}
          </p>
        </div>
      </div>

      <!-- Progress Bar (for certain statuses) -->
      ${status !== 'CANCELLED' ? `
      <div style="margin: 30px 0;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 11px; color: ${['PAID', 'PREPARING', 'READY', 'SHIPPED', 'DELIVERED'].includes(status) ? config.color : '#d1d5db'};">Confirmado</span>
          <span style="font-size: 11px; color: ${['PREPARING', 'READY', 'SHIPPED', 'DELIVERED'].includes(status) ? config.color : '#d1d5db'};">Preparando</span>
          <span style="font-size: 11px; color: ${['READY', 'SHIPPED', 'DELIVERED'].includes(status) ? config.color : '#d1d5db'};">Listo</span>
          <span style="font-size: 11px; color: ${['DELIVERED'].includes(status) ? config.color : '#d1d5db'};">Entregado</span>
        </div>
        <div style="background: #e5e7eb; height: 6px; border-radius: 3px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #667eea, #764ba2); height: 100%; width: ${status === 'PAID' ? '25%' :
          status === 'PREPARING' ? '50%' :
            status === 'READY' || status === 'SHIPPED' ? '75%' :
              status === 'DELIVERED' ? '100%' : '0%'
        }; border-radius: 3px; transition: width 0.5s;"></div>
        </div>
      </div>
      ` : ''}

      ${this.getButton('Ver detalles del pedido', `${process.env.FRONTEND_URL}/cuenta/pedidos`, '👀')}

      <!-- Help Section -->
      <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea10, #764ba210); border-radius: 12px; margin-top: 25px;">
        <p style="color: #667eea; font-size: 14px; font-weight: 600; margin: 0 0 5px;">¿Necesitas ayuda?</p>
        <p style="color: #6b7280; font-size: 13px; margin: 0;">Escríbenos a <a href="mailto:noreply@akemy.app" style="color: #667eea; text-decoration: none; font-weight: 600;">noreply@akemy.app</a></p>
      </div>
    `;

    return this.sendMail({
      to: email,
      subject: `${config.emoji} ${config.title} - Pedido #${orderNumber}`,
      html: this.getEmailTemplate(content, `${config.title} - Tu pedido #${orderNumber}`),
    });
  }
}
