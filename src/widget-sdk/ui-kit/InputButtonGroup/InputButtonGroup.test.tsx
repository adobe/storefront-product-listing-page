import { render } from '@testing-library/preact';

import { InputButtonGroup, InputButtonGroupProps } from './InputButtonGroup';

const mockButtonGroup: InputButtonGroupProps = {
  title: 'button',
  attribute: 'button',
  buckets: [],
  isSelected: () => true,
  onChange: () => {},
  type: 'radio',
};

describe('WidgetSDK - UIKit/InputButtonGroup', () => {
  test('renders', () => {
    const { container } = render(
      <InputButtonGroup
        title={mockButtonGroup.title}
        attribute={mockButtonGroup.attribute}
        buckets={mockButtonGroup.buckets}
        isSelected={mockButtonGroup.isSelected}
        onChange={mockButtonGroup.onChange}
        type={mockButtonGroup.type}
      />
    );

    const elem = container.querySelector('.ds-sdk-input');

    expect(!!elem).toEqual(true);
  });
});
