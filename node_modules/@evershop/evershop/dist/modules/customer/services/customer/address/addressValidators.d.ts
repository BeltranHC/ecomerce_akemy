import { Validator } from '../../../../../lib/util/validator.js';
export type Address = {
    uuid?: string;
    customer_id?: number;
    full_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    province?: string;
    country?: string;
    postcode?: string;
    telephone?: string | number;
    is_default?: number | string;
};
export declare function validateAddress(address: Address): {
    valid: boolean;
    errors: string[];
};
export declare function addAddressValidationRule(rule: Validator<Address>): void;
