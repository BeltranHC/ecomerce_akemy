declare class OrderItemDto {
    productId: string;
    variantId?: string;
    quantity: number;
}
declare class ShippingAddressDto {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode?: string;
}
export declare class CreateOrderDto {
    addressId?: string;
    shippingAddress?: ShippingAddressDto;
    items?: OrderItemDto[];
    useCart?: boolean;
    shippingCost?: number;
    discount?: number;
    notes?: string;
    paymentMethod?: string;
}
export {};
