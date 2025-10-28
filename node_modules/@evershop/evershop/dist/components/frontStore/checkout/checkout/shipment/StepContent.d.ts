export function StepContent({ addShippingAddressApi, shipmentInfo, setShipmentInfo, addresses }: {
    addShippingAddressApi: any;
    shipmentInfo: any;
    setShipmentInfo: any;
    addresses: any;
}): React.JSX.Element;
export namespace StepContent {
    namespace propTypes {
        let addShippingAddressApi: any;
        let setShipmentInfo: any;
        let shipmentInfo: any;
        let step: any;
        let addresses: any;
    }
    namespace defaultProps {
        export namespace shipmentInfo_1 {
            let address: {};
        }
        export { shipmentInfo_1 as shipmentInfo };
    }
}
import React from 'react';
