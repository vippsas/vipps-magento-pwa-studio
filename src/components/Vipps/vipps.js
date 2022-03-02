
import React, {useCallback, useEffect, useMemo} from 'react';
import { useLocation } from "react-router-dom";

import defaultClasses from "./vipps.module.css";
import {useMutation, useQuery} from "@apollo/client";
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import VIPPS_GET_PAYMENT_DETAILS from '../../talons/getPaymentDetails.gql';
import VIPPS_ACTIVATE_CART_MUTATION from "../../talons/activateCart.gql";
import {useStyle} from "@magento/venia-ui/lib/classify";
import {func, shape, string} from "prop-types";
import VippsPayment from "@vipps/module-payment/src/components/vipps.payment";
import {StoreTitle} from "@magento/venia-ui/lib/components/Head";
import {FormattedMessage, useIntl} from "react-intl";
import {useCartContext} from "@magento/peregrine/lib/context/cart";
import {useAwaitQuery} from "@magento/peregrine/lib/hooks/useAwaitQuery";
import GET_CART_DETAILS from "@magento/peregrine/lib/talons/CartPage/cartPage.gql";

const Vipps = (props) => {
    const classes = useStyle(defaultClasses, props.classes);
    const {formatMessage} = useIntl();
    const {getCartDetailsQuery} = GET_CART_DETAILS;

    const [{ cartId }, { createCart, removeCart, getCartDetails }] = useCartContext();

    const location = useLocation();
    const searchParams = useMemo(() => new URLSearchParams(location.search), [
        location
    ]);
    const orderNumber = searchParams.get('order_id');

    const { vippsActivateCartMutation } = VIPPS_ACTIVATE_CART_MUTATION;
    const [ fetchCartId ] = useMutation(vippsActivateCartMutation, {variables: {orderNumber}});
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const {vippsGetPaymentDetails} = VIPPS_GET_PAYMENT_DETAILS;
    const { data: transactionData, loading, error } = useQuery(vippsGetPaymentDetails, {
        variables: { orderNumber },
        fetchPolicy: 'no-cache'
    });

    let data = transactionData ? transactionData.vippsGetPaymentDetails : null;

    useEffect(async () => {
        if (data && data.cancelled && data.restore_cart) {
            await removeCart();
            await createCart({fetchCartId});

            await getCartDetails({
                                     fetchCartId,
                                     fetchCartDetails
                                 });
        }
    }, [data]);

    if (loading) {
        return fullPageLoadingIndicator;
    }

    if (data && data.reserved) {
        return (<div className={classes.root} data-cy="VippsConfirmationPage-root">
            <StoreTitle>
                {formatMessage({
                                   id: 'vipps.titleReceipt',
                                   defaultMessage: 'Order was reserved in Vipps'
                               })}
            </StoreTitle>
            <div className={classes.mainContainer}>
                <h2
                    data-cy="VippsConfirmationPage-header"
                    className={classes.heading}
                >
                    <FormattedMessage
                        id={'vippsPage.thankYou'}
                        defaultMessage={'Thank you for your payment! Your order was reserved in Vipps!'}
                    />
                </h2>
                <div
                    data-cy="VippsConfirmationPage-orderNumber"
                    className={classes.orderNumber}
                >
                    <FormattedMessage
                        id={'vipps.orderNumber'}
                        defaultMessage={'Order Number: {orderNumber}'}
                        values={{orderNumber}}
                    />
                </div>
            </div>
        </div>);
    } else if (data && data.cancelled) {
        return (<div className={classes.root} data-cy="VippsConfirmationPage-root">
            <StoreTitle>
                {formatMessage({
                                   id: 'vipps.titleReceipt',
                                   defaultMessage: 'Order was cancelled in Vipps'
                               })}
            </StoreTitle>
            <div className={classes.mainContainer}>
                <h2
                    data-cy="VippsConfirmationPage-header"
                    className={classes.heading}
                >
                    <FormattedMessage
                        id={'vippsPage.thankYou'}
                        defaultMessage={'Your order was cancelled in Vipps!'}
                    />
                </h2>
                <div
                    data-cy="VippsConfirmationPage-orderNumber"
                    className={classes.orderNumber}
                >
                    <FormattedMessage
                        id={'vipps.orderNumber'}
                        defaultMessage={'Order Number: {orderNumber}'}
                        values={{orderNumber}}
                    />
                </div>
            </div>
        </div>);
    }

    return (<div />);
};

export default Vipps;

VippsPayment.propTypes = {
    classes: shape({
        root: string,
        error: string,
        mainContainer: string,
        heading: string,
        orderNumber: string,
        email: string,
        name: string,
    }),
};
