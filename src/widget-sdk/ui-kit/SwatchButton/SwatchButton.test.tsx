import { SwatchButton } from './SwatchButton';

import { render } from '../../lib/tests';

describe('WidgetSDK - UIKit/PerPagePicker', () => {
  test('renders', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <SwatchButton
        key="test"
        value="test"
        type="text"
        checked={true}
        onClick={handleChange}
      />
    );

    const elem = container.querySelector('.ds-sdk-swatch-button');

    expect(!!elem).toEqual(true);
  });
});
