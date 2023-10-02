import { render } from '../../lib/tests';
import { SwatchButtonGroup, SwatchButtonGroupProps } from './SwatchButtonGroup';

const mockButtonGroup: SwatchButtonGroupProps = {
  swatches: [],
  isSelected: () => true,
  showMore: false,
  onClick: () => {},
  sku: 'test',
};

describe('WidgetSDK - UIKit/PerPagePicker', () => {
  test('renders', () => {
    const { container } = render(
      <SwatchButtonGroup
        isSelected={mockButtonGroup.isSelected}
        swatches={mockButtonGroup.swatches}
        showMore={mockButtonGroup.showMore}
        onClick={mockButtonGroup.onClick}
        sku={mockButtonGroup.sku}
      />
    );

    const elem = container.querySelector(
      '.ds-sdk-product-item__product-swatch-group'
    );

    expect(!!elem).toEqual(true);
  });
});
