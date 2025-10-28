import { Field } from '@components/common/form/Field';
import PropTypes from 'prop-types';
import React from 'react';
import { _ } from '../../../../../lib/locale/translate/_.js';
export function NameAndTelephone({ address }) {
    return (React.createElement("div", { className: "grid grid-cols-2 gap-4" },
        React.createElement("div", null,
            React.createElement(Field, { type: "text", name: "address[full_name]", value: address === null || address === void 0 ? void 0 : address.fullName, label: _('Full name'), placeholder: _('Full name'), validationRules: [
                    {
                        rule: 'notEmpty',
                        message: _('Full name is required')
                    }
                ] })),
        React.createElement("div", null,
            React.createElement(Field, { type: "text", name: "address[telephone]", value: address === null || address === void 0 ? void 0 : address.telephone, label: _('Telephone'), placeholder: _('Telephone'), validationRules: [
                    {
                        rule: 'notEmpty',
                        message: _('Telephone is required')
                    }
                ] }))));
}
NameAndTelephone.propTypes = {
    address: PropTypes.shape({
        fullName: PropTypes.string,
        telephone: PropTypes.string
    })
};
NameAndTelephone.defaultProps = {
    address: {}
};
//# sourceMappingURL=NameAndTelephone.js.map