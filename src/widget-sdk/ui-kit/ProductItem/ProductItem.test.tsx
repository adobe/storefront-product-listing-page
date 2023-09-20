import { render } from '@testing-library/preact';

import { sampleProductNotDiscounted } from './MockData';
import ProductItem from './ProductItem';
describe('WidgetSDK - UIKit/ProductItem', () => {
  test('renders', () => {
    const { container } = render(
      <ProductItem item={sampleProductNotDiscounted} currencySymbol="$" />
    );

    const elem = container.querySelector('.ds-sdk-product-item');

    expect(!!elem).toEqual(true);
  });
});
