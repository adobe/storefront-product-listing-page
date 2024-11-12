/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import ViewSwitcher from 'src/components/ViewSwitcher';

import Facets, {SelectedFilters} from '../components/Facets';
import { FilterButton } from '../components/FilterButton';
import { SearchBar } from '../components/SearchBar';
import { SortDropdown } from '../components/SortDropdown';
import {
  useAttributeMetadata,
  useProducts,
  useSearch,
  useStore,
  useTranslation,
} from '../context';
import { Facet } from '../types/interface';
import { getValueFromUrl, handleUrlSort } from '../utils/handleUrlFilters';
import {
  defaultSortOptions,
  generateGQLSortInput,
  getSortOptionsfromMetadata,
} from '../utils/sort';
import {ApplyFilterButton} from "../components/ApplyFilterButton";

interface Props {
  facets: Facet[];
  totalCount: number;
  screenSize: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
    columns: number;
  };
}
export const ProductsHeader: FunctionComponent<Props> = ({
  facets,
  totalCount,
  screenSize,
}) => {
  const searchCtx = useSearch();
  const storeCtx = useStore();
  const attributeMetadata = useAttributeMetadata();
  const productsCtx = useProducts();
  const translation = useTranslation();

  const [showMobileFacet, setShowMobileFacet] = useState(
    !!productsCtx.variables.filter?.length
  );
  const [sortOptions, setSortOptions] = useState(defaultSortOptions());

  const getSortOptions = useCallback(() => {
    setSortOptions(
      getSortOptionsfromMetadata(
        translation,
        attributeMetadata?.sortable,
        storeCtx?.config?.displayOutOfStock,
        storeCtx?.config?.currentCategoryUrlPath
      )
    );
  }, [storeCtx, translation, attributeMetadata]);

  useEffect(() => {
    getSortOptions();
  }, [getSortOptions]);

  const defaultSortOption = storeCtx.config?.currentCategoryUrlPath
    ? 'position_ASC'
    : 'relevance_DESC';
  const sortFromUrl = getValueFromUrl('product_list_order');
  const sortByDefault = sortFromUrl ? sortFromUrl : defaultSortOption;
  const [sortBy, setSortBy] = useState<string>(sortByDefault);
  const onSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    searchCtx.setSort(generateGQLSortInput(sortOption));
    handleUrlSort(sortOption);
  };
  return (
      <div className="flex flex-col lg:max-w-full ml-auto w-full h-full">
        <div
            className={`flex gap-x-2.5 mb-[1px] ${
                screenSize.mobile ? 'justify-between flex-wrap pb-[0.44rem]' : 'justify-between'
            }`}
        >
          {screenSize.mobile
              ? totalCount > 0 && (
              <div className="pb-[0.8rem]">
                <FilterButton
                    displayFilter={() => setShowMobileFacet(!showMobileFacet)}
                    type="mobile"
                    isFilterActive={searchCtx.filters?.length > 0}
                />
              </div>
          )
              : storeCtx.config.displaySearchBox && (
              <SearchBar
                  phrase={searchCtx.phrase}
                  onKeyPress={(e: any) => {
                    if (e.key === 'Enter') {
                      searchCtx.setPhrase(e?.target?.value);
                    }
                  }}
                  onClear={() => searchCtx.setPhrase('')}
                  placeholder={translation.SearchBar.placeholder}
              />
          )}
          {totalCount > 0 && (
              <>
                {!screenSize.mobile && <SelectedFilters/>}
                {storeCtx?.config?.listview && <ViewSwitcher/>}
                <SortDropdown
                    sortOptions={sortOptions}
                    value={sortBy}
                    onChange={onSortChange}
                    isMobile={screenSize.mobile}
                />
                {screenSize.mobile && <SelectedFilters/>}
              </>
          )}
        </div>
        {screenSize.mobile && showMobileFacet && <Facets searchFacets={facets}/>}
        {screenSize.mobile && showMobileFacet &&
            <div className="flex justify-center gap-x-[0.2rem]">
              <div className="ds-sdk-filter-button">
                <button
                    className="text-black border-black border-[1px] ring-black ring-opacity-5 text-[0.875rem] rounded-[0.7rem] w-[9.45rem] h-[2.6rem] font-['FuturaBT-Light']"
                    onClick={() => searchCtx.clearFilters()}
                >
                  {translation.Filter.clearAll+'(' + searchCtx.filterCount + ')'}
                </button>
              </div>
              <ApplyFilterButton
                  displayFilter={() => setShowMobileFacet(!showMobileFacet)}
                  title={translation.Filter.apply}
              />
            </div>
        }
      </div>
  );
};
