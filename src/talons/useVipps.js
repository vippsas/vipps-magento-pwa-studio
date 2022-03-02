import { useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import DEFAULT_OPERATIONS from './vipps.gql';
import {mapAddressData} from "@magento/peregrine/lib/talons/CheckoutPage/BillingAddress/useBillingAddress";

/**
 * Talon to handle checkmo payment.
 *
 * @param {Boolean} props.shouldSubmit boolean value which represents if a payment nonce request has been submitted
 * @param {Function} props.onPaymentSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onPaymentError callback to invoke when component throws an error
 * @param {Function} props.resetShouldSubmit callback to reset the shouldSubmit flag
 * @param {DocumentNode} props.operations.getCheckmoConfigQuery query to fetch config from backend
 * @param {DocumentNode} props.operations.setPaymentMethodOnCartMutation mutation to set checkmo as payment
 *
 * @returns {
 *  payableTo: String,
 *  mailingAddress: String,
 *  onBillingAddressChangedError: Function,
 *  onBillingAddressChangedSuccess: Function
 * }
 */
export const useVipps = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        setPaymentMethodOnCartMutation
    } = operations;

    const [{ cartId }] = useCartContext();

    const { resetShouldSubmit, onPaymentSuccess, onPaymentError } = props;

    const [
        updatePaymentMethod,
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(setPaymentMethodOnCartMutation);

    /**
     * This function will be called if cant not set address.
     */
    const onBillingAddressChangedError = useCallback(() => {
        resetShouldSubmit();
    }, [resetShouldSubmit]);

    const onBillingAddressChangedSuccess = useCallback(() => {
        updatePaymentMethod({
            variables: {
                cartId
            }
        });
    }, [updatePaymentMethod, cartId]);

    useEffect(() => {
        const paymentMethodMutationCompleted =
            paymentMethodMutationCalled && !paymentMethodMutationLoading;

        if (paymentMethodMutationCompleted && !paymentMethodMutationError) {
            onPaymentSuccess();
        }

        if (paymentMethodMutationCompleted && paymentMethodMutationError) {
            onPaymentError();
        }
    }, [
      paymentMethodMutationError,
      paymentMethodMutationLoading,
      paymentMethodMutationCalled,
      onPaymentSuccess,
      onPaymentError,
      resetShouldSubmit
    ]);

    return {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    };
};
