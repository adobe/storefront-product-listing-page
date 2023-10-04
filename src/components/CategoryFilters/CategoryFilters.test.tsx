/// <reference types="@types/jest" />;
import { render } from '@testing-library/preact';

import { CategoryFilters } from './CategoryFilters';

describe('PLP widget/CategoryFilters', () => {
  it('renders', () => {
    const { container } = render(
      <CategoryFilters
        loading={true}
        totalCount={1}
        facets={[]}
        categoryName=""
        phrase=""
        setShowFilters={() => true}
      />
    );

    const elem = container.querySelector('.ds-widgets_actions_header');

    expect(!!elem).toEqual(true);
  });
});
