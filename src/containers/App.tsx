/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import Enrichment from 'src/components/Enrichment';
import FilterButton from 'src/components/FilterButton';
import Loading from 'src/components/Loading';
import Shimmer from 'src/components/Shimmer';

import { CategoryFilters } from '../components/CategoryFilters';
import {FranchiseViewSelector} from "../components/Facets/FranchiseViewSelector";
import {
  useProducts,
  useSearch,
  useSensor,
  useStore,
  useTranslation,
} from '../context';
import { MobileFilterHeader } from './MobileFilterHeader';
import { ProductsContainer } from './ProductsContainer';


export const App: FunctionComponent = () => {
  const searchCtx = useSearch();
  const productsCtx = useProducts();
  const { screenSize } = useSensor();
  const translation = useTranslation();
  const { displayMode, categoryConfig } = useStore().config;
  const [showFilters, setShowFilters] = useState(true);

  const loadingLabel = translation.Loading.title;
  const displayByFranchise = categoryConfig?.pcm_display_by_franchise === '1';

  return (
    <>
      {!(displayMode === 'PAGE') &&
        (!screenSize.mobile && showFilters && productsCtx.facets.length > 0 ? (
          <div className="ds-widgets bg-body py-2">
            {searchCtx.phrase && (
              <div className="product-list-page-header flex flex-col gap-4 justify-center items-center h-[180px] lg:h-[248px]">
                <h1 className="text-center capitalize">
                  {searchCtx.phrase}
                </h1>
              </div>
            )}
            <Enrichment position={'below-title'} />
            <div className="flex flex-col">
              {productsCtx.totalCount && (
                <CategoryFilters
                  loading={productsCtx.loading}
                  pageLoading={productsCtx.pageLoading}
                  facets={productsCtx.facets}
                  totalCount={productsCtx.totalCount}
                  categoryName={productsCtx.categoryName ?? ''}
                  phrase={productsCtx.variables.phrase ?? ''}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  filterCount={searchCtx.filterCount}
                />
              )}
              <Enrichment position={'above-grid'} />
              <div
                className={`ds-widgets_results flex flex-col items-center flex-[75] ds-widgets-results__center-container `}
              >
                <ProductsContainer showFilters={showFilters} />
              </div>
            </div>
          </div>
        ) : (
          <div className="ds-widgets bg-body py-2">
            {searchCtx.phrase && (
              <div className="product-list-page-header flex flex-col gap-4 justify-center items-center h-[180px] lg:h-[248px]">
                <h1 className="text-center capitalize">
                  {searchCtx.phrase}
                </h1>
              </div>
            )}
            <Enrichment position={'below-title'} />
            <div className="flex flex-col">
              <div className="ds-widgets_results flex flex-col items-center flex-[75]">
                <div className="flex w-full h-full">
                  {!screenSize.mobile &&
                    !productsCtx.loading &&
                    productsCtx.facets.length > 0 && (
                      <div className="flex w-full h-full">
                        <FilterButton
                          displayFilter={() => setShowFilters(true)}
                          type="desktop"
                          title={`${translation.Filter.showTitle}${
                            searchCtx.filterCount > 0
                              ? ` (${searchCtx.filterCount})`
                              : ''
                          }`}
                        />
                      </div>
                    )}
                </div>
                {productsCtx.loading ? (
                  screenSize.mobile ? (
                    <Loading label={loadingLabel} />
                  ) : (
                    <Shimmer />
                  )
                ) : (
                  <>
                    <div className="flex w-full h-full testing">
                      <MobileFilterHeader
                        facets={productsCtx.facets}
                        totalCount={productsCtx.totalCount}
                        screenSize={screenSize}
                      />
                    </div>
                    {displayByFranchise && (
                      <FranchiseViewSelector />
                    )}
                    <Enrichment position={'above-grid'} />
                    <ProductsContainer
                      showFilters={showFilters && productsCtx.facets.length > 0}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default App;
