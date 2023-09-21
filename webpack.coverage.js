const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');
const babelConfig = require('./babelrc');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const PORT = 8080;

const MAJOR_VERSION = `v${pkg.version.split('.')[0]}`;

const publicPaths = {
  DEV: `http://localhost:${PORT}/${MAJOR_VERSION}/`,
  QA: `https://plp-widgets-ui-qa.magento-datasolutions.com/${MAJOR_VERSION}/`,
  PROD: `https://plp-widgets-ui.magento-ds.com/${MAJOR_VERSION}/`,
};

const plugins = [
  new CleanWebpackPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.ProvidePlugin({
    React: 'react',
  }),
  new webpack.ProvidePlugin({
    'react-dom': 'ReactDOM',
  }),
  new HtmlWebpackPlugin({
    title: 'Spectrum App',
    template: path.join(__dirname, 'dev-template.html'),
  }),
  new webpack.DefinePlugin({
    'process.env.SCALE_MEDIUM': 'true',
    'process.env.SCALE_LARGE': 'false',
    'process.env.THEME_LIGHT': 'false',
    'process.env.THEME_LIGHTEST': 'true',
    'process.env.THEME_DARK': 'false',
    'process.env.THEME_DARKEST': 'false',
  }),
  new webpack.ProvidePlugin({
    process: 'process/browser',
  }),
  new ForkTsCheckerWebpackPlugin(),
  new webpack.DefinePlugin({
    API_URL: JSON.stringify('https://catalog-service-qa.adobe.io/graphql'),
    TEST_URL: JSON.stringify('https://catalog-service-qa.adobe.io/graphql'),
    LS_API_URL: JSON.stringify('https://commerce-int.adobe.io/search/graphql'),
    API_KEY: JSON.stringify('storefront-catalog-apollo'),
    FLOODGATE_API_KEY: JSON.stringify('ds-live-search-mfe'),
    FLOODGATE_CLIENT_ID: JSON.stringify('ds-live-search-mfe-dev'),
  }),
];

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src', 'index.tsx'),
  output: {
    crossOriginLoading: 'anonymous', // add 'anonymous' to script tag for CORS
    path: path.resolve(__dirname, 'dist'),
    publicPath: publicPaths.DEV,

    filename: '[name].js',
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: { ...babelConfig },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        sideEffects: true,
      },
      {
        test: /\.svg$/,
        use: ['preact-svg-loader'],
        // use: ['@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.mdx?$/,
        use: ['babel-loader', '@mdx-js/loader'],
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    modules: ['.', 'node_modules', '@adobe/ds-widget-sdk'],
    alias: {
      containers: path.resolve(__dirname, 'src/containers'),
      components: path.resolve(__dirname, 'src/components'),
      context: path.resolve(__dirname, 'src/context/'),
      gql: path.resolve(__dirname, 'src/gql/'),
      hooks: path.resolve(__dirname, 'src/hooks/'),
      'test-utils': path.resolve(__dirname, 'src/test-utils/'),
      utils: path.resolve(__dirname, 'src/utils'),
      process: 'process/browser',
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat', // Must be below test-utils
      'react/jsx-runtime': 'preact/jsx-runtime',
      // Add aliases here if needed -->  `alias: path.resolve(__dirname, "src/alias-path"),`
    },
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.svg',
      '.css',
      '.json',
      '.mdx',
      '.mjs',
    ],
    fallback: {
      // node ignore fs is for MDX parsing
      fs: false,
    },
  },
  watchOptions: {
    aggregateTimeout: 100, // delay before reloading
    ignored: ['src/.DS_Store', '**/.DS_Store', '**/node_modules'],
  },
  target: 'web',
  devServer: {
    compress: true,
    port: PORT,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
    open: [publicPaths.DEV],
    allowedHosts: ['all'],
    hot: false,
    inline: false,
    host: '0.0.0.0',
    client: {
      webSocketURL: `ws://localhost:${PORT}/ws`,
    },
  },

  performance: {
    hints: false,
  },
  stats: 'minimal',
  plugins,
};
