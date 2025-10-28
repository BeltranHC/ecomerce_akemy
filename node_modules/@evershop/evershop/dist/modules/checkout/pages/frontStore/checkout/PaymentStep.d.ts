declare function PaymentStep({ cart }: {
    cart: any;
}): React.JSX.Element;
declare namespace PaymentStep {
    namespace propTypes {
        let cart: any;
    }
}
export default PaymentStep;
export namespace layout {
    let areaId: string;
    let sortOrder: number;
}
export const query: "\n  query Query {\n    cart {\n      billingAddress {\n        id: cartAddressId\n        fullName\n        postcode\n        telephone\n        country {\n          code\n          name\n        }\n        province {\n          code\n          name\n        }\n        city\n        address1\n        address2\n      }\n      addBillingAddressApi: addAddressApi\n      addPaymentMethodApi\n    }\n  }\n";
import React from 'react';
