/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useTranslation } from '../../context/translation';
import { Facet } from '../../types/interface';
import { Facets } from '../Facets';
import { FilterButton } from '../FilterButton';

interface CategoryFiltersProps {
  loading: boolean;
  pageLoading: boolean;
  totalCount: number;
  facets: Facet[];
  categoryName: string;
  phrase: string;
  showFilters: boolean;
  setShowFilters: (showFilters: boolean) => void;
  filterCount: number;
}

export const CategoryFilters: FunctionComponent<CategoryFiltersProps> = ({
  loading,
  pageLoading,
  totalCount,
  facets,
  categoryName,
  phrase,
  setShowFilters,
  filterCount,
}) => {
  const translation = useTranslation();
  let title = categoryName || '';
  if (phrase) {
    const text = translation.CategoryFilters.results;
    title = text.replace('{phrase}', `"${phrase}"`);
  }
  const resultsTranslation = translation.CategoryFilters.products;
  const results = resultsTranslation.replace('{totalCount}', `${totalCount}`);

  return (
    <div class="sm:flex ds-widgets-_actions relative max-w-[21rem] w-full h-full px-2 flex-col overflow-y-auto">
      <div className="ds-widgets_actions_header flex justify-between items-center mb-md">
        {title && <span> {title}</span>}
        {!loading && <span className="text-primary text-sm">{results}</span>}
      </div>

      {!pageLoading && facets.length > 0 && (
        <>
          <div className="flex pb-4 w-full h-full">
            <FilterButton
              displayFilter={() => setShowFilters(false)}
              type="desktop"
              title={`${translation.Filter.hideTitle}${
                filterCount > 0 ? ` (${filterCount})` : ''
              }`}
            />
          </div>
          <Facets searchFacets={facets} />
        </>
      )}
    </div>
  );
};
