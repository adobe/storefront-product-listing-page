/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from '@testing-library/preact';

import { ProductList } from './ProductList';

describe('WidgetSDK - UIKit/ProductList', () => {
  test('renders', () => {
    const { container } = render(
      <ProductList products={[]} numberOfColumns={0} showFilters={true} prevProducts={[]} />
    );

    const elem = container.querySelector('.ds-sdk-product-list');

    expect(!!elem).toEqual(true);
  });
});
