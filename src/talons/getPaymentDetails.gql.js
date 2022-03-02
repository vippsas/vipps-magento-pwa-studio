import { gql } from '@apollo/client';
import {VIPPS_INIT_PAYMENT} from "@vipps/module-payment/src/talons/initPayment.gql";

const VIPPS_GET_PAYMENT_DETAILS = gql`
    query vippsGetPaymentDetails(
        $orderNumber: String!
    ) {
        vippsGetPaymentDetails(order_number: $orderNumber) {
            order_number
            cancelled
            reserved
            restore_cart
        }
    }
`;

export default {
    vippsGetPaymentDetails: VIPPS_GET_PAYMENT_DETAILS
};
