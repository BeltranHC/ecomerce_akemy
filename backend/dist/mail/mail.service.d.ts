export declare class MailService {
    private readonly logger;
    private transporter;
    private readonly fromEmail;
    private readonly storeName;
    constructor();
    private sendMail;
    sendVerificationEmail(email: string, token: string): Promise<boolean>;
    sendPasswordResetEmail(email: string, token: string): Promise<boolean>;
    sendOrderConfirmationEmail(email: string, orderData: {
        orderNumber: string;
        items: Array<{
            name: string;
            quantity: number;
            price: number;
        }>;
        subtotal: number;
        tax: number;
        shipping: number;
        total: number;
        shippingAddress: string;
    }): Promise<boolean>;
    sendOrderStatusUpdateEmail(email: string, orderNumber: string, status: string, statusMessage: string): Promise<boolean>;
}
