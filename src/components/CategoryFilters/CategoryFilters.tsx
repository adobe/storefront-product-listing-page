/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { Facet } from '../../types/interface';
import { Facets } from '../Facets';

interface CategoryFiltersProps {
  pageLoading: boolean;
  totalCount: number;
  facets: Facet[];
  displayFilter: () => void;
}

export const CategoryFilters: FunctionComponent<CategoryFiltersProps> = ({
  pageLoading,
  totalCount,
  facets,
  displayFilter,
}) => {

  return (
    <div className="sm:flex ds-widgets-_actions relative max-width-[480px] flex-[25] flex-col">
      {!pageLoading && facets.length > 0 && (
        <Facets searchFacets={facets} totalCount={totalCount} displayFilter={displayFilter} />
      )}
    </div>
  );
};
