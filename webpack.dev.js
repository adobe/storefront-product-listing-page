const { merge } = require('webpack-merge');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { commonConfig, publicPaths } = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'development',
  watch: false,
  output: {
    publicPath: publicPaths.DEV,
  },
  plugins: [
    new webpack.DefinePlugin({
      API_URL: JSON.stringify('https://catalog-service-qa.adobe.io/graphql'),
      TEST_URL: JSON.stringify('https://catalog-service-qa.adobe.io/graphql'),
      LS_API_URL: JSON.stringify(
        'https://commerce-int.adobe.io/search/graphql'
      ),
      API_KEY: JSON.stringify('storefront-catalog-apollo'),
      FLOODGATE_CLIENT_ID: JSON.stringify('ds-live-search-mfe-dev'),
    }),
    new HtmlWebpackPlugin({
      title: 'LiveSearch PLP',
      template: './dev-template.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ],
});
