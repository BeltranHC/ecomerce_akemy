import { Field } from '@components/common/form/Field';
import { Province } from '@components/frontStore/customer/address/addressForm/Province';
import PropTypes from 'prop-types';
import React from 'react';
import { _ } from '../../../../../lib/locale/translate/_.js';
export function ProvinceAndPostcode({ address, allowCountries, selectedCountry }) {
    var _a;
    return (React.createElement("div", { className: "grid grid-cols-2 gap-4 mt-4" },
        React.createElement(Province, { allowCountries: allowCountries, selectedCountry: selectedCountry, selectedProvince: (_a = address === null || address === void 0 ? void 0 : address.province) === null || _a === void 0 ? void 0 : _a.code, fieldName: "address[province]" }),
        React.createElement("div", null,
            React.createElement(Field, { type: "text", name: "address[postcode]", value: address === null || address === void 0 ? void 0 : address.postcode, label: _('Postcode'), placeholder: _('Postcode'), validationRules: [
                    {
                        rule: 'notEmpty',
                        message: _('Postcode is required')
                    }
                ] }))));
}
ProvinceAndPostcode.propTypes = {
    address: PropTypes.shape({
        province: PropTypes.shape({
            code: PropTypes.string
        }),
        postcode: PropTypes.string
    }),
    allowCountries: PropTypes.arrayOf(PropTypes.shape({
        code: PropTypes.string,
        name: PropTypes.string,
        provinces: PropTypes.arrayOf(PropTypes.shape({
            code: PropTypes.string,
            name: PropTypes.string
        }))
    })).isRequired,
    selectedCountry: PropTypes.string
};
ProvinceAndPostcode.defaultProps = {
    address: {},
    selectedCountry: ''
};
//# sourceMappingURL=ProvinceAndPostcode.js.map