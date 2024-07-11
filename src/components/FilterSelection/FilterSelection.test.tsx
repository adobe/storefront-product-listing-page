import { render } from '@testing-library/preact';

import { FilterSelection, FilterSelectionProps } from './FilterSelection';

const mockFilterSelectionProps: FilterSelectionProps = {
  title: 'Filter Title',
  handleFilter: () => {},
  selectedNumber: 5,
};

describe('WidgetSDK - FilterSelection', () => {
  test('renders', () => {
    const { container } = render(
      <FilterSelection
        title={mockFilterSelectionProps.title}
        handleFilter={mockFilterSelectionProps.handleFilter}
        selectedNumber={mockFilterSelectionProps.selectedNumber}
      />
    );

    const elem = container.querySelector('.ds-sdk-input');

    expect(!!elem).toEqual(true);
  });
});
