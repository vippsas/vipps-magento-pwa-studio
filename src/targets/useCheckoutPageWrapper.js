import { useEffect } from 'react';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useMutation } from "@apollo/client";

import VIPPS_INIT_PAYMENT_MUTATION from '../talons/initPayment.gql';

const wrapUseCheckoutPage = (original) => {
    return (props = {}, ...restArgs) => {
        const {orderNumber, handlePlaceOrder, ...defaultReturnData} = original(
            props,
            ...restArgs
        );

        const [{ cartId }] = useCartContext();
        const { vippsInitPaymentMutation } = VIPPS_INIT_PAYMENT_MUTATION;
        const [
            vippsInitPayment,
            {
                data: initData,
                error: initError,
                loading: initLoading
            }
        ] = useMutation(vippsInitPaymentMutation, {
            onCompleted: () => {
                handlePlaceOrder();
            }
        });

        const handlePlaceOrderWrapper = function () {
            const fallbackUrl = window.location.origin.toString() + '/';
            vippsInitPayment({
                 variables: {
                     cartId,
                     fallbackUrl
                 },
             });
        };

        useEffect(() => {
            if (orderNumber && initData.vippsInitPayment.url) {
                window.location.href = initData.vippsInitPayment.url;
            }
        }, [orderNumber, initData, initError, initLoading]);

        return {
            ...defaultReturnData,
            orderNumber,
            handlePlaceOrder: handlePlaceOrderWrapper
        };
    }
};

export default wrapUseCheckoutPage;
