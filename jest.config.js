const config = {
  preset: 'jest-preset-preact',

  roots: ['<rootDir>/src'],
  clearMocks: true,
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom', 'jest-styled-components'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.svg$': 'jest-transformer-svg',
  },
  moduleDirectories: ['<rootDir>/src', 'node_modules'],
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
    '^components(.*)$': '<rootDir>/src/components$1',
    '^styles(.*)$': '<rootDir>/src/styles$1',
    '^utils(.*)$': '<rootDir>/src/utils$1',

    // Add aliases here ---> "^alias(.*)$": "<rootDir>/src/alias-path$1", <---
  },
  testPathIgnorePatterns: ['<rootDir>/src/components/Facets'],
  globals: {
    API_URL: 'https://catalog-service-qa.adobe.io/graphql',
    WIDGET_CONFIG_URL: 'https://storefront-cfg-qa.magento-datasolutions.com',
    API_KEY: 'storefront-catalog-apollo',
  },
};

module.exports = config;
