const path = require('path');

module.exports = {
  managerWebpack: async (config) => {
    return config;
  },

  managerBabel: async (config) => {
    return config;
  },

  webpackFinal: async (config) => {
    // Development Server
    config.devServer = {
      ...config.devServer,
      headers: {
        ...config.devServer?.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
      },
    };

    // this modifies the existing image rule to exclude .svg files
    // since we want to handle those files with @svgr/webpack
    const imageRule = config.module.rules.find((rule) =>
      rule.test.test('.svg')
    );
    imageRule.exclude = /\.svg$/;

    // configure .svg files to be loaded with @svgr/webpack fo ts/tsx files
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.tsx?$/,
      use: ['@svgr/webpack'],
    });
    // configure .svg files to be loaded as static files for mdx files
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.mdx$/,
      type: 'asset/resource',
      generator: { filename: 'static/media/[path][name][ext]' },
    });

    // Return the altered config
    return config;
  },

  babel: async (config) => {
    config.cacheDirectory = false;
    return {
      ...config,
      presets: [
        [
          '@babel/typescript',
          {
            jsxPragma: 'h',
          },
        ],
      ],
      plugins: [['babel-plugin-tsconfig-paths'], ...config.plugins],
    };
  },

  previewHead: (head) => {
    return `
          ${head}
      
          <style>
            body {
              background: #fff !important;
              color: #111 !important;
            }
      
            .sbdocs h1,
            .sbdocs h2,
            .sbdocs h3,
            .sbdocs h4,
            .sbdocs h5,
            .sbdocs h6 {
                margin: 1em 0 !important;
            }
      
            .sbdocs h2 {
              padding-bottom: .65em !important;
            }
          </style>
        `;
  },

  previewAnnotations: (entry = []) => {
    return [...entry, path.resolve(__dirname, './preview')];
  },

  managerEntries: (entry = []) => {
    return [...entry, path.resolve(__dirname, './manager')];
  },
};
