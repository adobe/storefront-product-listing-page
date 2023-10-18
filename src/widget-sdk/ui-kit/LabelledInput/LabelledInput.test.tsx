import { render } from '@testing-library/preact';

import { LabelledInput } from './LabelledInput';

describe('WidgetSDK - UIKit/InputButtonGroup', () => {
  test('renders', () => {
    const { container } = render(
      <LabelledInput
        type="checkbox"
        checked={false}
        name=""
        onChange={() => {}}
        label=""
        value=""
        attribute=""
      />
    );

    const elem = container.querySelector('.ds-sdk-labelled-input');

    expect(!!elem).toEqual(true);
  });
});
