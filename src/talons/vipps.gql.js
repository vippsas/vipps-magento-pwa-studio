import { gql } from '@apollo/client';

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethod($cartId: String!) {
        setPaymentMethodOnCart(
            input: { cart_id: $cartId, payment_method: { code: "vipps" } }
        ) {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export default {
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART
};
