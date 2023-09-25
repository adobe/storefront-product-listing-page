import { render } from '@testing-library/preact';

import { SearchBar } from './SearchBar';

describe('WidgetSDK - UIKit/SearchBar', () => {
  test('renders', () => {
    const { container } = render(
      <SearchBar phrase="" onKeyPress={() => {}} onClear={() => {}} />
    );

    const elem = container.querySelector('.ds-sdk-search-bar');

    expect(!!elem).toEqual(true);
  });
});
