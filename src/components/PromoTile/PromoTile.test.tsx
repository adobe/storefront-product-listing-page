/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from '@testing-library/preact';

import { samplePromoTile } from './MockData';
import PromoTile from './PromoTile';

beforeEach(() => {
  // IntersectionObserver isn't available in test environment
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
});

describe('WidgetSDK - UIKit/PromoTile', () => {
  test('renders', () => {
    const { container } = render(
      <PromoTile        
        setRoute={undefined}        
        promoTile={samplePromoTile}
      />
    );

    // TODO: fix test, this isn't what we want to test for
    const elem = container.querySelector('.promo-tile');

    expect(!!elem).toEqual(true);
  });
});
