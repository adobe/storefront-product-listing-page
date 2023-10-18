import { render } from '@testing-library/preact';

import { SwatchButton } from './SwatchButton';

describe('WidgetSDK - UIKit/SwatchButton', () => {
  test('renders', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <SwatchButton
        id="test"
        value="test"
        type="text"
        checked={true}
        onClick={handleChange}
      />
    );

    const elem = container.querySelector('.ds-sdk-swatch-button_test');

    expect(!!elem).toEqual(true);
  });
});
