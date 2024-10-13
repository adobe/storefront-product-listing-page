/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { Drawer } from 'src/components/Drawer/Drawer';
import MobileFacets from 'src/components/MobileFacets';
import Chevron from '../icons/chevron.svg';

import { FilterButton } from '../components/FilterButton';
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
import { CategoryFilters } from "../components";

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

export const MobileFilterHeader: FunctionComponent<Props> = ({
  facets,
  totalCount,
  screenSize,
}) => {
  const searchCtx = useSearch();
  const storeCtx = useStore();
  const attributeMetadata = useAttributeMetadata();
  const productsCtx = useProducts();
  const translation = useTranslation();

  const attributesToFilter = [
    'featured',
    'new',
    'price',
  ];

  const filteredAttributes = attributeMetadata?.sortable.filter((item) =>
    attributesToFilter.includes(item.attribute)
  );

  const [showMobileFacet, setShowMobileFacet] = useState(
    !!productsCtx.variables.filter?.length
  );
  const [sortOptions, setSortOptions] = useState(defaultSortOptions());

  const getSortOptions = useCallback(() => {
    setSortOptions(
      getSortOptionsfromMetadata(
        translation,
        filteredAttributes,
        storeCtx?.config?.displayOutOfStock,
        storeCtx?.config?.currentCategoryUrlPath,
        storeCtx?.config?.currentCategoryId
      )
    );
  }, [storeCtx, translation, attributeMetadata]);

  useEffect(() => {
    getSortOptions();
  }, [getSortOptions]);

  const defaultSortOption =
    storeCtx.config?.currentCategoryUrlPath ||
    storeCtx.config?.currentCategoryId
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

  if (totalCount === 0) {
    return null;
  }

  const [showFilters, setShowFilters] = useState(true);
  return (
    <div className="flex flex-col max-w-5xl lg:max-w-full ml-auto w-full h-full">
      {!screenSize.mobile && productsCtx.totalCount && (
        <CategoryFilters
          loading={productsCtx.loading}
          pageLoading={productsCtx.pageLoading}
          facets={productsCtx.facets}
          totalCount={productsCtx.totalCount}
          categoryName={productsCtx.categoryName ?? ''}
          phrase={productsCtx.variables.phrase ?? ''}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          displayFilter={() => setShowMobileFacet(!showMobileFacet)}
          filterCount={searchCtx.filterCount}
        />
      )}
      {screenSize.mobile && (
        <div className="flex border-t border-b border-neutral-400 bg-black">
          <div className="flex justify-center w-full py-md border-r border-neutral-400">
            <FilterButton
              displayFilter={() => setShowMobileFacet(!showMobileFacet)}
              type="mobile"
            />
          </div>
        </div>
      )}
      <div class="mobile-filters-container z-900">
        <Drawer
          isOpen={showMobileFacet}
          onClose={() => setShowMobileFacet(!showMobileFacet)}
          totalCount={totalCount}
        >
          <MobileFacets
            searchFacets={facets}
            onClose={() => setShowMobileFacet(!showMobileFacet)}
            sortOptions={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            mobile
          />
        </Drawer>
      </div>
    </div>
  );
};
