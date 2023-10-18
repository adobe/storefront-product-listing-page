/// <reference types="@types/jest" />;
import { render } from '@testing-library/preact';

import { PriceFacet } from '../../../types/interface';
import { ScalarFacet } from './ScalarFacet';

describe('PLP widget/RangeFacet', () => {
  it('renders', () => {
    const { container } = render(<ScalarFacet filterData={{} as PriceFacet} />);

    const elem = container.querySelector('.ds-sdk-input');

    expect(!!elem).toEqual(true);
  });
});
