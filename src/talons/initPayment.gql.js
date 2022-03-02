import { gql } from '@apollo/client';

const VIPPS_INIT_PAYMENT = gql`
    mutation vippsInitPayment($cartId: String!, $fallbackUrl: String) {
        vippsInitPayment(
            input: { cart_id: $cartId, fallback_url: $fallbackUrl}
        ) {
            url
        }
    }
`;

export default {
    vippsInitPaymentMutation: VIPPS_INIT_PAYMENT
};
