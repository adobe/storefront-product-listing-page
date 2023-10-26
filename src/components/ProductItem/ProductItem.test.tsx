/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from '@testing-library/preact';

import { sampleProductNotDiscounted } from './MockData';
import ProductItem from './ProductItem';

describe('WidgetSDK - UIKit/ProductItem', () => {
  test('renders', () => {
    const { container } = render(
      <ProductItem
        item={sampleProductNotDiscounted}
        currencySymbol="$"
        currencyRate="USD"
        setRoute={undefined}
        refineProduct={() => {}}
      />
    );

    const elem = container.querySelector('.ds-sdk-product-item');

    expect(!!elem).toEqual(true);
  });
});
