import { render } from '@testing-library/preact';

import { FilterSelection, FilterSelectionProps } from './FilterSelection';

const mockFilterSelectionProps: FilterSelectionProps = {
  title: 'Filter Title',
  iteration: 1,
};

describe('WidgetSDK - FilterSelection', () => {
  test('renders', () => {
    const { container } = render(
      <FilterSelection
        title={mockFilterSelectionProps.title}
        iteration={mockFilterSelectionProps.iteration}
      />
    );

    const elem = container.querySelector('.ds-sdk-input');

    expect(!!elem).toEqual(true);
  });
});
