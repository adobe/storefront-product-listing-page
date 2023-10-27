/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

/// <reference types="@types/jest" />;
import { render } from '@testing-library/preact';

import Loading from './Loading';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('WidgetSDK - UIKit/Loading', () => {
  test('renders', () => {
    const { container } = render(<Loading label="" />);

    const elem = container.querySelector('.ds-sdk-loading');

    expect(!!elem).toEqual(true);
  });
});
