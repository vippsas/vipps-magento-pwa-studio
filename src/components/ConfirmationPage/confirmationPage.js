
import React, {useCallback, useEffect, useMemo} from 'react';
import { useLocation } from "react-router-dom";

import defaultClasses from "./confirmationPage.module.css";
import {useMutation, useQuery} from "@apollo/client";
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import VIPPS_GET_PAYMENT_DETAILS from '../../talons/getPaymentDetails.gql';
import VIPPS_ACTIVATE_CART_MUTATION from "../../talons/activateCart.gql";
import VIPPS_GET_STORE_CONFIGURATION from '../../talons/getStoreConfiguration.gql';
import {useStyle} from "@magento/venia-ui/lib/classify";
import {StoreTitle} from "@magento/venia-ui/lib/components/Head";
import {FormattedMessage, useIntl} from "react-intl";
import {useCartContext} from "@magento/peregrine/lib/context/cart";
import {useAwaitQuery} from "@magento/peregrine/lib/hooks/useAwaitQuery";
import GET_CART_DETAILS from "@magento/peregrine/lib/talons/CartPage/cartPage.gql";

const ConfirmationPage = (props) => {
    const {formatMessage} = useIntl();
    const {getCartDetailsQuery} = GET_CART_DETAILS;
    const {getVippsStoreConfigurationQuery} = VIPPS_GET_STORE_CONFIGURATION;
    let classes = useStyle(defaultClasses, props.classes);
    const [{ cartId }, { createCart, removeCart, getCartDetails }] = useCartContext();

    const location = useLocation();
    const searchParams = useMemo(() => new URLSearchParams(location.search), [
        location
    ]);
    const orderNumber = searchParams.get('order_id');

    const { vippsActivateCartMutation } = VIPPS_ACTIVATE_CART_MUTATION;
    const [ fetchCartId ] = useMutation(vippsActivateCartMutation, {variables: {orderNumber}});
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const { data: vippsPaymentConfig } = useQuery(getVippsStoreConfigurationQuery);
    let vippsLabel = vippsPaymentConfig.storeConfig ? vippsPaymentConfig.storeConfig.vipps_label : 'Vipps';
    let vippsVersion = vippsPaymentConfig.storeConfig ? vippsPaymentConfig.storeConfig.vipps_version : 'vipps_payment';

    if (vippsVersion !== 'vipps_payment') {
        classes.mainContainer = classes.mainContainerMobile;
    }

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
                                   defaultMessage: `Order was reserved in ${vippsLabel}`
                               })}
            </StoreTitle>
            <div className={classes.mainContainer}>
                <h2
                    data-cy="VippsConfirmationPage-header"
                    className={classes.heading}
                >
                    <FormattedMessage
                        id={'vippsPage.thankYou'}
                        defaultMessage={`Thank you for your payment! Your order was reserved in ${vippsLabel}!`}
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
                                   defaultMessage: `Order was cancelled in ${vippsLabel}`
                               })}
            </StoreTitle>
            <div className={classes.mainContainer}>
                <h2
                    data-cy="VippsConfirmationPage-header"
                    className={classes.heading}
                >
                    <FormattedMessage
                        id={'vippsPage.thankYou'}
                        defaultMessage={`Your order was cancelled in ${vippsLabel}!`}
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

export default ConfirmationPage;

