import { render } from '@testing-library/preact';

import { ProductList } from './ProductList';

describe('WidgetSDK - UIKit/ProductList', () => {
  test('renders', () => {
    const { container } = render(
      <ProductList
        products={[]}
        numberOfColumns={0}
        currencySymbol=""
        currencyRate=""
      />
    );

    const elem = container.querySelector('.ds-sdk-product-list');

    expect(!!elem).toEqual(true);
  });
});
