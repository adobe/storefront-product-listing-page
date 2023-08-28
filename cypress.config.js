const { defineConfig } = require('cypress');

module.exports = defineConfig({
  defaultCommandTimeout: 30000,
  fixturesFolder: 'src/fixtures',
  video: false,
  pageLoadTimeout: 30000,
  requestTimeout: 60000,
  viewportHeight: 900,
  viewportWidth: 1440,
  scrollBehavior: 'nearest',
  trashAssetsBeforeRuns: false,
  chromeWebSecurity: false,
  retries: {
    runMode: 2,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      require('./plp-ui-tests/src/plugins/index.js')(on, config);
      require('@cypress/code-coverage/task')(on, config);
      return config;
    },
    baseUrl: 'http://localhost:8080/v1/',
    supportFile: 'plp-ui-tests/src/support/index.js',
    specPattern: 'plp-ui-tests/src/tests/**/*.spec.js',
  },
});
