export function StepContent({ cart: { billingAddress, addBillingAddressApi, addPaymentMethodApi } }: {
    cart: {
        billingAddress: any;
        addBillingAddressApi: any;
        addPaymentMethodApi: any;
    };
}): React.JSX.Element;
export namespace StepContent {
    namespace propTypes {
        let cart: any;
    }
}
import React from 'react';
