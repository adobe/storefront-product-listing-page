/// <reference types="@types/jest" />;
import { render } from '@testing-library/preact';

import Pagination from './Pagination';

describe('PLP widget/Pagination', () => {
  it('renders', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={3}
        pageSize={12}
        onPageChange={() => {}}
      />
    );

    const elem = container.querySelector('.ds-plp-pagination');

    expect(!!elem).toEqual(true);
  });
});
