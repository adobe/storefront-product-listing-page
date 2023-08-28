/// <reference types="@types/jest" />;
import { render } from '@testing-library/preact';
import { PriceFacet } from 'src/types/interface';

import { RangeFacet } from './RangeFacet';

describe('PLP widget/RangeFacet', () => {
  it('renders', () => {
    const { container } = render(<RangeFacet filterData={{} as PriceFacet} />);

    const elem = container.querySelector('.ds-sdk-input');

    expect(!!elem).toEqual(true);
  });
});
