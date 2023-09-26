import { render } from '../../lib/tests';
import { PerPagePicker } from './PerPagePicker';

describe('WidgetSDK - UIKit/PerPagePicker', () => {
  test('renders', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <PerPagePicker
        value={12}
        pageSizeOptions={[{ label: '12', value: 12 }]}
        onChange={handleChange}
      />
    );

    const elem = container.querySelector('.ds-sdk-per-page-picker');

    expect(!!elem).toEqual(true);
  });
});
