/*
Copyright 2026 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { fireEvent, render, screen } from '@testing-library/preact';

import { useProducts } from '../context';
import { ProductsHeader } from './ProductsHeader';

jest.mock('../context', () => ({
  ...jest.requireActual('../context'),
  useProducts: jest.fn(),
}));

const mobileScreen = {
  mobile: true,
  tablet: false,
  desktop: false,
  columns: 2,
};

describe('ProductsHeader mobile filters', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  test.each([
    { query: '', filter: [] },
    {
      query: '?categories=women%2Ftops-women%2Fjackets-women',
      filter: [
        { attribute: 'categories', in: ['women/tops-women/jackets-women'] },
      ],
    },
    {
      query: '?wa_type=Sensors',
      filter: [{ attribute: 'wa_type', in: ['Sensors'] }],
    },
  ])(
    'starts closed and toggles on demand with URL "$query"',
    ({ query, filter }) => {
      window.history.replaceState({}, '', `/${query}`);
      const variables = { phrase: '', filter };
      jest.mocked(useProducts).mockReturnValue({
        variables,
      } as ReturnType<typeof useProducts>);

      const { container } = render(
        <ProductsHeader facets={[]} totalCount={12} screenSize={mobileScreen} />
      );

      expect(container.querySelector('.ds-plp-facets')).toBeNull();

      fireEvent.click(screen.getByRole('button', { name: /filters/i }));
      expect(container.querySelector('.ds-plp-facets')).not.toBeNull();

      fireEvent.click(screen.getByRole('button', { name: /filters/i }));
      expect(container.querySelector('.ds-plp-facets')).toBeNull();
      expect(window.location.search).toBe(query);
      expect(variables.filter).toEqual(filter);
    }
  );
});
