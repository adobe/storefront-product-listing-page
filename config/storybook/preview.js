import { DocsContainer, DocsPage } from '@storybook/addon-docs';

import '../../src/styles/index.css';

export const parameters = {
  docs: {
    container: (props) => <DocsContainer {...props} />,
    page: DocsPage,
    controls: { exclude: ['style'] },
  },
  actions: { argTypesRegex: '^on.*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => {
    return (
      <div className="ds-widgets">
        <Story />
      </div>
    );
  },
];
