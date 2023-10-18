import { render } from '@testing-library/preact';

import { SortDropdown } from './SortDropdown';

describe('WidgetSDK - UIKit/SortDropdown', () => {
  test('renders', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <SortDropdown
        value="relevance_DESC"
        sortOptions={[{ label: 'Most Relevant', value: 'relevance_DESC' }]}
        onChange={handleChange}
      />
    );

    const elem = container.querySelector('.ds-sdk-sort-dropdown');

    expect(!!elem).toEqual(true);
  });
});
