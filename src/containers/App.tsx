import { FunctionComponent } from 'preact';
import { useContext } from 'preact/hooks';
import { CategoryFilters } from 'src/components/CategoryFilters';
import { PreviewHeader } from 'src/components/PreviewHeader';
import { TranslationContext } from 'src/context/translation';

import { useProducts, useStore } from '../context';
import { Loading } from '../widget-sdk/ui-kit';
import { ProductsContainer } from './ProductsContainer';

export const App: FunctionComponent = () => {
  const productsCtx = useProducts();
  const { displayMode } = useStore().config;

  const translation = useContext(TranslationContext);

  const loadingLabel = translation.Loading.title;

  return (
    <>
      {!(displayMode === 'PAGE') && (
        <div className="ds-widgets bg-body py-2">
          <div className="flex">
            <CategoryFilters
              loading={productsCtx.loading}
              facets={productsCtx.facets}
              totalCount={productsCtx.totalCount}
              categoryName={productsCtx.categoryName ?? ''}
              phrase={productsCtx.variables.phrase ?? ''}
            />
            <div className="ds-widgets_results flex flex-col items-center w-full h-full">
              {productsCtx.loading ? (
                <Loading label={loadingLabel} />
              ) : (
                <>
                  <PreviewHeader facets={productsCtx.facets} />
                  <ProductsContainer />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
