import { gql } from '@apollo/client';

const VIPPS_ACTIVATE_CART = gql`
    mutation vippsActivateCart($orderNumber: String!) {
        cartId: vippsActivateCart(order_number: $orderNumber)
    }
`;

export default {
    vippsActivateCartMutation: VIPPS_ACTIVATE_CART
};
