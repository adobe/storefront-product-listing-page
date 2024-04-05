const { merge } = require('webpack-merge');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { commonConfig, publicPaths } = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'development',
  output: {
    publicPath: publicPaths.DEV,
  },
  plugins: [
    new webpack.DefinePlugin({
      API_URL: JSON.stringify('https://catalog-service-sandbox.adobe.io/graphql'),
      TEST_URL: JSON.stringify(
        'https://catalog-service-sandbox.adobe.io/graphql'
      ),
      SANDBOX_KEY: JSON.stringify('storefront-widgets'),
    }),
    new HtmlWebpackPlugin({
      title: 'LiveSearch PLP',
      template: './dev-template.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ],
});
