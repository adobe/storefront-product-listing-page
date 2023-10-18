const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const lumaPort = 8081;
const PORT = process.env.PORT || lumaPort;

const banner = `${pkg.name}@v${pkg.version}`;
const MAJOR_VERSION = `v${pkg.version.split('.')[0]}`;

const publicPaths = {
  DEV: `http://localhost:${PORT}/${MAJOR_VERSION}/`,
  QA: ``,
  PROD: ``,
};

const commonConfig = {
  experiments: {
    outputModule: true,
  },
  entry: {
    search: './src',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'module',
  },
  watchOptions: {
    aggregateTimeout: 100, // delay before reloading
  },
  devServer: {
    compress: true,
    // host: '',
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
    open: publicPaths.DEV,
    allowedHosts: ['all'],
    watchFiles: ['src/**/*', 'public/**/*', 'dist/**/*'],
    hot: true,
    liveReload: false,
    host: '0.0.0.0',
    client: {
      webSocketURL: `ws://localhost:${PORT}/ws`,
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.svg$/,
        use: ['preact-svg-loader'],
      },
    ],
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js',
      '.jsx',
      '.svg',
      '.css',
      '.json',
      '.mdx',
      '.mjs',
    ],
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat', // Must be below test-utils
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
    plugins: [
      new TsconfigPathsPlugin({
        /* options: */
        configFile: 'tsconfig.json',
      }),

    ],
  },
  plugins: [
    new webpack.BannerPlugin(banner),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: {
          banner,
        },
      }),
    ],
  },
};

module.exports = { commonConfig, publicPaths };
