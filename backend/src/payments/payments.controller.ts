import { Controller, Post, Body, Get, Param, UseGuards, Request, RawBodyRequest, Headers, Logger } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('payments')
export class PaymentsController {
    private readonly logger = new Logger(PaymentsController.name);

    constructor(
        private paymentsService: PaymentsService,
        private prisma: PrismaService,
    ) { }

    @Post('create-preference')
    @UseGuards(JwtAuthGuard)
    async createPreference(
        @Body() body: { orderId: string },
        @Request() req: { user: { id: string } },
    ) {
        // Verificar que la orden pertenece al usuario
        const order = await this.prisma.order.findFirst({
            where: {
                id: body.orderId,
                userId: req.user.id,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                user: true,
            },
        });

        if (!order) {
            throw new Error('Orden no encontrada');
        }

        // Crear preferencia de pago
        const preference = await this.paymentsService.createPreference({
            orderId: order.id,
            items: order.items.map(item => ({
                title: item.product.name,
                quantity: item.quantity,
                unit_price: Number(item.price),
            })),
            payer: {
                email: order.user.email,
                name: `${order.user.firstName} ${order.user.lastName}`,
            },
        });

        return preference;
    }

    @Post('webhook')
    async handleWebhook(
        @Body() body: any,
        @Headers('x-signature') signature: string,
    ) {
        this.logger.log('Webhook recibido de Mercado Pago');
        this.logger.log(JSON.stringify(body));

        // Procesar notificación
        if (body.type && body.data) {
            await this.paymentsService.handleWebhook(body.type, body.data);
        }

        return { received: true };
    }

    @Get('status/:id')
    @UseGuards(JwtAuthGuard)
    async getPaymentStatus(@Param('id') id: string) {
        return this.paymentsService.getPaymentStatus(id);
    }

    @Get('config')
    getConfig() {
        return {
            isConfigured: this.paymentsService.isConfigured(),
            publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY || null,
        };
    }
}
