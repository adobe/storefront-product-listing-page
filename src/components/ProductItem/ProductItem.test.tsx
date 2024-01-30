/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from '@testing-library/preact';

import { StoreContextProvider } from '../../context';
import { sampleProductNotDiscounted } from './MockData';
import ProductItem from './ProductItem';

describe('WidgetSDK - UIKit/ProductItem', () => {
  test('renders', () => {
    const context = {
      environmentId: '',
      environmentType: '',
      websiteCode: '',
      storeCode: '',
      storeViewCode: '',
      apiUrl: '',
      apiKey: '',
      config: {
        optimizeImages: true,
        imageBaseWidth: 200,
      },
      context: {},
      route: undefined,
      searchQuery: 'q',
    };

    const { container } = render(
      <StoreContextProvider {...context}>
        <ProductItem
          item={sampleProductNotDiscounted}
          currencySymbol="$"
          currencyRate="USD"
          setRoute={undefined}
          refineProduct={() => {}}
        />
      </StoreContextProvider>
    );

    const elem = container.querySelector('.ds-sdk-product-item');

    expect(!!elem).toEqual(true);
  });
});
