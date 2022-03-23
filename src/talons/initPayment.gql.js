import { gql } from '@apollo/client';

const VIPPS_INIT_PAYMENT = gql`
    mutation vippsInitPayment($cartId: String!, $fallbackUrl: String, $deactivateCart: Boolean) {
        vippsInitPayment(
            input: { cart_id: $cartId, fallback_url: $fallbackUrl, deactivate_cart: $deactivateCart}
        ) {
            url
        }
    }
`;

export default {
    vippsInitPaymentMutation: VIPPS_INIT_PAYMENT
};
