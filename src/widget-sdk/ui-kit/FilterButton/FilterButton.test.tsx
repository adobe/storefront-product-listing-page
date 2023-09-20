import { render } from '@testing-library/preact';

import { FilterButton } from './FilterButton';

describe('WidgetSDK - UIKit/FilterButton', () => {
  test('renders', () => {
    const { container } = render(
      <FilterButton
        displayFilter={() => {
          return;
        }}
      />
    );

    const elem = container.querySelector('.ds-sdk-filter-button');

    expect(!!elem).toEqual(true);
  });
});
