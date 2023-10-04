import { render } from '../../lib/tests';
import { SwatchButtonGroup, SwatchButtonGroupProps } from './SwatchButtonGroup';

const mockButtonGroup: SwatchButtonGroupProps = {
  swatches: [
    {
      title: 'Blue',
      id: 'Y29uZmlndXJhYmxlLzkzLzU5',
      type: 'COLOR_HEX',
      value: '#1857f7',
    },
    {
      title: 'Purple',
      id: 'Y29uZmlndXJhYmxlLzkzLzY2',
      type: 'COLOR_HEX',
      value: '#ef3dff',
    },
    {
      title: 'Red',
      id: 'Y29uZmlndXJhYmxlLzkzLzY3',
      type: 'COLOR_HEX',
      value: '#ff0000',
    },
  ],
  isSelected: () => true,
  showMore: false,
  onClick: () => {},
  sku: 'test',
};

describe('WidgetSDK - UIKit/SwatchButtonGroup', () => {
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
