/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from '@testing-library/preact';

import { PriceFacet } from '@/types/interface';

import { SliderDoubleControl } from './SliderDoubleControl';

describe('PLP widget/SliderDoubleControl', () => {
  test('renders', () => {
    const filterData: PriceFacet = {
      title: 'Price',
      attribute: 'price',
      buckets: [
        {
          title: '10.0-25.0',
          __typename: 'RangeBucket',
          from: 10,
          to: 25,
          count: 1,
        },
        {
          title: '25.0-50.0',
          __typename: 'RangeBucket',
          from: 25,
          to: 50,
          count: 10,
        },
        {
          title: '50.0-75.0',
          __typename: 'RangeBucket',
          from: 50,
          to: 75,
          count: 1,
        },
      ],
    };
    const { container } = render(
      <SliderDoubleControl filterData={filterData} />
    );

    const elem = container.querySelector('.ds-sdk-slider');

    expect(!!elem).toEqual(true);
  });
});
