const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { commonConfig, publicPaths } = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'none',
  output: {
    publicPath: publicPaths.QA,
  },
  plugins: [
    ...commonConfig.plugins,
    new webpack.DefinePlugin({
      API_URL: JSON.stringify('https://catalog-service-qa.adobe.io/graphql'),
      WIDGET_CONFIG_URL: JSON.stringify(
        'https://storefront-cfg-qa.magento-datasolutions.com'
      ),
      LS_API_URL: JSON.stringify(
        'https://commerce-int.adobe.io/search/graphql'
      ),
      TEST_URL: JSON.stringify('https://catalog-service-qa.adobe.io/graphql'),
      API_KEY: JSON.stringify('storefront-catalog-apollo'),
      FLOODGATE_CLIENT_ID: JSON.stringify('ds-live-search-mfe-qa'),
      'process.env.NODE_ENV': JSON.stringify('qa'),
    }),
  ],

  optimization: {
    minimize: true,
  },
});
