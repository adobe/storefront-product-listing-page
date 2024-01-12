const { merge } = require('webpack-merge');
const webpack = require('webpack');
const { commonConfig, publicPaths } = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'production',
  output: {
    publicPath: publicPaths.PROD,
  },
  plugins: [
    ...commonConfig.plugins,
    new webpack.DefinePlugin({
      API_URL: JSON.stringify('https://catalog-service.adobe.io/graphql'),
      WIDGET_CONFIG_URL: JSON.stringify(
        'https://storefront-configuration.magento-ds.com'
      ),
      TEST_URL: JSON.stringify(
        'https://catalog-service-sandbox.adobe.io/graphql'
      ),
      LS_API_URL: JSON.stringify('https://commerce.adobe.io/search/graphql'),
      API_KEY: JSON.stringify('storefront-widgets'),
      FLOODGATE_CLIENT_ID: JSON.stringify('ds-live-search-mfe-prod'),
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  optimization: {
    minimize: true,
  },
});
