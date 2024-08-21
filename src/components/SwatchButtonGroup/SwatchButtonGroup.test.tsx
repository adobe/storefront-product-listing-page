/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from '@testing-library/preact';

import { SwatchButtonGroup, SwatchButtonGroupProps } from './SwatchButtonGroup';

class ResizeObserver {
  constructor() {
  }

  observe() {
  }
  unobserve() {
  }
  disconnect() {
  }
}

global.ResizeObserver = ResizeObserver;

const mockButtonGroup: SwatchButtonGroupProps = {
  swatches: [
    {
      title: 'Blue',
      id: 'Y29uZmlndXJhYmxlLzkzLzU5',
      type: 'COLOR_HEX',
      value: '#1857f7',
    },
    {
      title: 'Purple',
      id: 'Y29uZmlndXJhYmxlLzkzLzY2',
      type: 'COLOR_HEX',
      value: '#ef3dff',
    },
    {
      title: 'Red',
      id: 'Y29uZmlndXJhYmxlLzkzLzY3',
      type: 'COLOR_HEX',
      value: '#ff0000',
    },
  ],
  isSelected: () => true,
  showMore: () => {},
  productUrl: '',
  onClick: () => {},
  sku: 'test',
};

describe('WidgetSDK - UIKit/SwatchButtonGroup', () => {
  test('renders', () => {
    const { container } = render(
      <SwatchButtonGroup
        isSelected={mockButtonGroup.isSelected}
        swatches={mockButtonGroup.swatches}
        showMore={mockButtonGroup.showMore}
        productUrl={mockButtonGroup.productUrl}
        onClick={mockButtonGroup.onClick}
        sku={mockButtonGroup.sku}
      />
    );

    const elem = container.querySelector(
      '.ds-sdk-product-item__product-swatch-group'
    );

    expect(!!elem).toEqual(true);
  });
});
