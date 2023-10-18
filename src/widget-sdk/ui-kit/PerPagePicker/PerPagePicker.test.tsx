/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from '@testing-library/preact';

import { PerPagePicker } from './PerPagePicker';

describe('WidgetSDK - UIKit/PerPagePicker', () => {
  test('renders', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <PerPagePicker
        value={12}
        pageSizeOptions={[{ label: '12', value: 12 }]}
        onChange={handleChange}
      />
    );

    const elem = container.querySelector('.ds-sdk-per-page-picker');

    expect(!!elem).toEqual(true);
  });
});
