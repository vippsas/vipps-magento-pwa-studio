
module.exports = (targets) => {
    const peregrineTargets = targets.of("@magento/peregrine");
    const talonsTarget = peregrineTargets.talons;

    talonsTarget.tap(talons => {
       talons.CheckoutPage.useCheckoutPage.wrapWith('@vipps/module-payment/src/targets/useCheckoutPageWrapper');
    });

    const { specialFeatures } = targets.of("@magento/pwa-buildpack");
    /**
     *  Wee need to activate esModules, cssModules and GQL Queries to allow build pack to load our extension
     * {@link https://magento.github.io/pwa-studio/pwa-buildpack/reference/configure-webpack/#special-flags}.
     */
    specialFeatures.tap((flags) => {
        flags[targets.name] = {
          esModules: true,
          cssModules: true,
          graphqlQueries: true,
        };
    });

    /** Registers our Payment **/
    const { checkoutPagePaymentTypes } = targets.of("@magento/venia-ui");
    checkoutPagePaymentTypes.tap((payments) =>
        payments.add({
          paymentCode: "vipps",
          importPath: "@vipps/module-payment/src/components/vipps.payment.js",
        })
    );

    targets.of("@magento/venia-ui").routes.tap((routes) => {
        routes.push({
                        name: "Vipps",
                        pattern: "/vipps/payment/fallback",
                        path: require.resolve("./src/components/Vipps/vipps.js"),
                    });
        return routes;
    });
};
