declare function ShipmentStep({ account, cart: { shippingAddress, shippingMethod, addShippingMethodApi, addShippingAddressApi } }: {
    account: any;
    cart: {
        shippingAddress: any;
        shippingMethod: any;
        addShippingMethodApi: any;
        addShippingAddressApi: any;
    };
}): React.JSX.Element | null;
declare namespace ShipmentStep {
    namespace propTypes {
        let account: any;
        let cart: any;
    }
    namespace defaultProps {
        export namespace account_1 {
            let addresses: never[];
        }
        export { account_1 as account };
    }
}
export default ShipmentStep;
export namespace layout {
    let areaId: string;
    let sortOrder: number;
}
export const query: "\n  query Query {\n    account: currentCustomer {\n      addresses {\n        uuid\n        fullName\n        address1\n        city\n        postcode\n        country {\n          name\n          code\n        }\n        province {\n          name\n          code\n        }\n        telephone\n        isDefault\n      }\n    }\n    cart {\n      shippingMethod\n      shippingMethodName\n      shippingAddress {\n        id: cartAddressId\n        fullName\n        postcode\n        telephone\n        country {\n          code\n          name\n        }\n        province {\n          code\n          name\n        }\n        city\n        address1\n        address2\n      }\n      addShippingAddressApi: addAddressApi\n      addShippingMethodApi\n    }\n  }\n";
import React from 'react';
