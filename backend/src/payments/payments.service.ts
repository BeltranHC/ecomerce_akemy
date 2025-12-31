import { Injectable, Logger } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { PrismaService } from '../prisma/prisma.service';

interface CreatePreferenceDto {
    orderId: string;
    items: Array<{
        title: string;
        quantity: number;
        unit_price: number;
    }>;
    payer: {
        email: string;
        name: string;
    };
}

@Injectable()
export class PaymentsService {
    private readonly logger = new Logger(PaymentsService.name);
    private client: MercadoPagoConfig | null = null;
    private preferenceClient: Preference | null = null;
    private paymentClient: Payment | null = null;

    constructor(private prisma: PrismaService) {
        const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

        if (accessToken) {
            this.client = new MercadoPagoConfig({ accessToken });
            this.preferenceClient = new Preference(this.client);
            this.paymentClient = new Payment(this.client);
            this.logger.log('✅ Mercado Pago configurado correctamente');
        } else {
            this.logger.warn('⚠️ MERCADO_PAGO_ACCESS_TOKEN no configurado');
        }
    }

    async createPreference(data: CreatePreferenceDto) {
        if (!this.preferenceClient) {
            throw new Error('Mercado Pago no está configurado');
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

        try {
            const preference = await this.preferenceClient.create({
                body: {
                    items: data.items.map(item => ({
                        id: data.orderId,
                        title: item.title,
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        currency_id: 'PEN',
                    })),
                    payer: {
                        email: data.payer.email,
                        name: data.payer.name,
                    },
                    back_urls: {
                        success: `${frontendUrl}/checkout/success?order=${data.orderId}`,
                        failure: `${frontendUrl}/checkout/failure?order=${data.orderId}`,
                        pending: `${frontendUrl}/checkout/pending?order=${data.orderId}`,
                    },
                    auto_return: 'approved',
                    external_reference: data.orderId,
                    notification_url: `${backendUrl}/api/payments/webhook`,
                    statement_descriptor: 'AKEMY',
                },
            });

            this.logger.log(`Preferencia creada: ${preference.id} para orden ${data.orderId}`);

            // Guardar referencia en la orden
            await this.prisma.order.update({
                where: { id: data.orderId },
                data: {
                    notes: `MP_PREFERENCE:${preference.id}`,
                },
            });

            return {
                id: preference.id,
                init_point: preference.init_point,
                sandbox_init_point: preference.sandbox_init_point,
            };
        } catch (error) {
            this.logger.error('Error creando preferencia:', error);
            throw error;
        }
    }

    async handleWebhook(type: string, data: any) {
        this.logger.log(`Webhook recibido: ${type}`);

        if (type === 'payment') {
            const paymentId = data.id;

            if (!this.paymentClient) {
                this.logger.warn('Payment client no disponible');
                return { received: true };
            }

            try {
                const payment = await this.paymentClient.get({ id: paymentId });
                const orderId = payment.external_reference;
                const status = payment.status;

                this.logger.log(`Pago ${paymentId} - Estado: ${status} - Orden: ${orderId}`);

                if (orderId) {
                    // Actualizar estado de la orden según el pago
                    if (status === 'approved') {
                        await this.prisma.order.update({
                            where: { id: orderId },
                            data: {
                                status: 'PAID',
                                paymentStatus: 'PAID',
                                paidAt: new Date(),
                            },
                        });
                        this.logger.log(`Orden ${orderId} marcada como PAGADA`);
                    } else if (status === 'pending' || status === 'in_process') {
                        await this.prisma.order.update({
                            where: { id: orderId },
                            data: {
                                paymentStatus: 'PENDING',
                            },
                        });
                    } else if (status === 'rejected' || status === 'cancelled') {
                        await this.prisma.order.update({
                            where: { id: orderId },
                            data: {
                                paymentStatus: 'FAILED',
                            },
                        });
                    }
                }
            } catch (error) {
                this.logger.error('Error procesando webhook:', error);
            }
        }

        return { received: true };
    }

    async getPaymentStatus(paymentId: string) {
        if (!this.paymentClient) {
            throw new Error('Mercado Pago no está configurado');
        }

        try {
            const payment = await this.paymentClient.get({ id: parseInt(paymentId) });
            return {
                id: payment.id,
                status: payment.status,
                status_detail: payment.status_detail,
                external_reference: payment.external_reference,
            };
        } catch (error) {
            this.logger.error('Error obteniendo estado de pago:', error);
            throw error;
        }
    }

    isConfigured(): boolean {
        return this.client !== null;
    }
}
