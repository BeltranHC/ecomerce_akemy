import { MovementType } from '@prisma/client';
export declare class UpdateStockDto {
    quantity: number;
    type: MovementType;
    notes?: string;
}
