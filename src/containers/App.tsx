/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useContext, useState } from 'preact/hooks';

import { CategoryFilters } from '../components/CategoryFilters';
import { useProducts, useSensor, useStore } from '../context';
import { TranslationContext } from '../context/translation';
import { FilterButton, Loading } from '../widget-sdk/ui-kit';
import { ProductsContainer } from './ProductsContainer';
import { ProductsHeader } from './ProductsHeader';

export const App: FunctionComponent = () => {
  const productsCtx = useProducts();
  const { screenSize } = useSensor();
  const { displayMode } = useStore().config;
  const [showFilters, setShowFilters] = useState(true);

  const translation = useContext(TranslationContext);

  const loadingLabel = translation.Loading.title;

  let title = productsCtx.categoryName || '';
  if (productsCtx.variables.phrase) {
    const text = translation.CategoryFilters.results;
    title = text.replace('{phrase}', `"${productsCtx.variables.phrase ?? ''}"`);
  }

  return (
    <>
      {!(displayMode === 'PAGE') &&
        (!screenSize.mobile && showFilters ? (
          <div className="ds-widgets bg-body py-2">
            <div className="flex">
              <CategoryFilters
                loading={productsCtx.loading}
                facets={productsCtx.facets}
                totalCount={productsCtx.totalCount}
                categoryName={productsCtx.categoryName ?? ''}
                phrase={productsCtx.variables.phrase ?? ''}
                setShowFilters={setShowFilters}
              />
              <div
                className={`ds-widgets_results flex flex-col items-center ${
                  productsCtx.categoryName ? 'pt-16' : 'pt-28'
                } w-full h-full`}
              >
                <ProductsHeader
                  facets={productsCtx.facets}
                  totalCount={productsCtx.totalCount}
                  screenSize={screenSize}
                />
                {productsCtx.loading ? (
                  <Loading label={loadingLabel} />
                ) : (
                  <ProductsContainer showFilters={showFilters} />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="ds-widgets bg-body py-2">
            <div className="flex flex-col">
              <div className="flex flex-col items-center w-full h-full">
                <div className="justify-start w-full h-full">
                  <div class="hidden sm:flex ds-widgets-_actions relative max-w-[21rem] w-full h-full px-2 flex-col overflow-y-auto">
                    <div className="ds-widgets_actions_header flex justify-between items-center mb-md">
                      {title && <span> {title}</span>}
                      {!productsCtx.loading && (
                        <span className="text-primary text-sm">
                          {productsCtx.totalCount}{' '}
                          {translation.CategoryFilters.products}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="ds-widgets_results flex flex-col items-center w-full h-full">
                <div className="flex w-full h-full">
                  {!screenSize.mobile && (
                    <div className="flex w-full h-full">
                      <FilterButton
                        displayFilter={() => setShowFilters(true)}
                        type="desktop"
                        title={translation.Filter.showTitle}
                      />
                    </div>
                  )}
                  <div className="flex w-full h-full">
                    <ProductsHeader
                      facets={productsCtx.facets}
                      totalCount={productsCtx.totalCount}
                      screenSize={screenSize}
                    />
                  </div>
                </div>
                {productsCtx.loading ? (
                  <Loading label={loadingLabel} />
                ) : (
                  <>
                    <ProductsContainer showFilters={showFilters} />
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
