module.exports = {
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-essentials',
    '@adobe/ds-widget-sdk/config/storybook/addon', // core storybook config
    '@adobe/ds-widget-sdk/storybook-stories', // core stories
    '../storybook-stories', // this project stories
  ],
};
