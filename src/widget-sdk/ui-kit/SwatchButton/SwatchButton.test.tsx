import { render } from '../../lib/tests';
import { SwatchButton } from './SwatchButton';

describe('WidgetSDK - UIKit/PerPagePicker', () => {
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

    const elem = container.querySelector('.ds-sdk-swatch-button');

    expect(!!elem).toEqual(true);
  });
});
