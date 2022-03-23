/**
 */
import React, { useEffect, useState } from 'react';
import { bool, func, shape, string } from 'prop-types';

import { useVipps } from './useVipps';
import defaultClasses from './vipps.payment.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import BillingAddress from "@magento/venia-ui/lib/components/CheckoutPage/BillingAddress";

const CONTAINER_ID = 'vipps-container';
const errorText =
    'There was an error loading payment options. Please try again later.';
/**
 */
const VippsPayment = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { resetShouldSubmit, onPaymentSuccess, onPaymentError } = props;
    const [isError, setIsError] = useState(false);

    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = useVipps({resetShouldSubmit, onPaymentSuccess, onPaymentError});

    if (isError) {
        return <span className={classes.error}>{errorText}</span>;
    }

    return (
        <div className={classes.root}>
            <div id={CONTAINER_ID} />
            <BillingAddress
                shouldSubmit={props.shouldSubmit}
                resetShouldSubmit={props.resetShouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

VippsPayment.propTypes = {
    classes: shape({
       root: string,
       error: string
    }),
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

export default VippsPayment;
