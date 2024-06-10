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
  // loading,
  pageLoading,
  totalCount,
  facets,
  // categoryName,
  // phrase,
  // setShowFilters,
  // filterCount,
}) => {
  const translation = useTranslation();
  const title = translation.Filter.title; // categoryName || '';
  // if (phrase) {
  //   const text = translation.CategoryFilters.results;
  //   title = text.replace('{phrase}', `"${phrase}"`);
  // }
  const resultsTranslation = translation.CategoryFilters.products;
  const results = resultsTranslation.replace('{totalCount}', `${totalCount}`);

  // sm:flex ds-widgets-_actions relative max-width-[480px] flex-[25] px-2 flex-col overflow-y-auto top-[6.4rem] right-0 bottom-[48px] left-0 box-content

  return (
    <div className="sm:flex ds-widgets-_actions relative max-width-[480px] flex-[25] px-2 flex-col">
      <div className="ds-widgets_actions_header flex justify-between items-center mb-md">
        {title && <span className="font-display-3"> {title}</span>}
        {/* {!loading && (
          <span className="text-brand-700 font-button-2">{results}</span>
        )} */}
      </div>

      {!pageLoading && facets.length > 0 && (
        <>
          <div className="flex pb-4">
            {/* <FilterButton
              displayFilter={() => setShowFilters(false)}
              type="desktop"
              title={`${translation.Filter.hideTitle}${
                filterCount > 0 ? ` (${filterCount})` : ''
              }`}
            /> */}
          </div>
          <Facets searchFacets={facets} />
        </>
      )}
    </div>
  );
};
