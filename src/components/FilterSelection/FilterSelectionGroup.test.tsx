import { render } from '@testing-library/preact';

import {
  FilterSelectionGroup,
  FilterSelectionGroupProps,
} from './FilterSelectionGroup';

const mockFilterSelectionGroupProps: FilterSelectionGroupProps = {
  title: 'Filter Group Title',
  attribute: 'filterGroup',
  buckets: [],
  isSelected: () => true,
  onChange: () => {},
  type: 'checkbox',
};

describe('WidgetSDK - FilterSelectionGroup', () => {
  test('renders', () => {
    const { container } = render(
      <FilterSelectionGroup
        title={mockFilterSelectionGroupProps.title}
        attribute={mockFilterSelectionGroupProps.attribute}
        buckets={mockFilterSelectionGroupProps.buckets}
        isSelected={mockFilterSelectionGroupProps.isSelected}
        onChange={mockFilterSelectionGroupProps.onChange}
        type={mockFilterSelectionGroupProps.type}
      />
    );

    const elem = container.querySelector('.ds-sdk-input');

    expect(!!elem).toEqual(true);
  });
});
