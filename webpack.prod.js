const { merge } = require("webpack-merge");
const webpack = require("webpack");
const { commonConfig, publicPaths } = require("./webpack.common.js");

module.exports = merge(commonConfig, {
    mode: "production",
    output: {
        publicPath: publicPaths.PROD,
    },
    plugins: [
        ...commonConfig.plugins,
        new webpack.DefinePlugin({
            API_URL: JSON.stringify("https://catalog-service.adobe.io/graphql"),
            TEST_URL: JSON.stringify("https://catalog-service-sandbox.adobe.io/graphql"),
            SANDBOX_KEY: JSON.stringify("storefront-widgets"),
            "process.env.NODE_ENV": JSON.stringify("production"),
        }),
    ],
    optimization: {
        minimize: true,
    },
});
