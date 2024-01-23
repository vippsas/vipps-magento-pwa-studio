import { gql } from '@apollo/client';

const VIPPS_GET_STORE_CONFIGURATION = gql`
    query getVippsStoreConfiguration {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            vipps_version
            vipps_label
        }
    }
`;

export default {
    getVippsStoreConfigurationQuery: VIPPS_GET_STORE_CONFIGURATION
};
