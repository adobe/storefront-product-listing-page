const path = require('path');

module.exports = {
  stories: [
    path.resolve(__dirname, './src/**/*.mdx'),
    path.resolve(__dirname, './src/**/*.stories.@(js|jsx|ts|tsx)'),
  ],
};
