import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

const theme = create({
  base: 'dark',
  brandTitle: 'Product Listing Widgets',
});

addons.setConfig({
  theme,
});
