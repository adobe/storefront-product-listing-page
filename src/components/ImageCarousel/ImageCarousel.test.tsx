/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from '@testing-library/preact';

import { ImageCarousel } from './ImageCarousel';

describe('WidgetSDK - UIKit/ImageCarousel', () => {
  test('renders', () => {
    const { container } = render(<ImageCarousel images={[]} productName="" />);

    const elem = container.querySelector('.ds-sdk-product-image-carousel');

    expect(!!elem).toEqual(true);
  });
});
