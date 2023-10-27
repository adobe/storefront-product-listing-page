/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useContext } from 'preact/hooks';
import { useProducts, useSensor } from 'src/context';
import { TranslationContext } from 'src/context/translation';
import {
  handleUrlPageSize,
  handleUrlPagination,
} from 'src/utils/handleUrlFilters';

import { Alert, PerPagePicker, ProductList } from '../components';
import Pagination from '../components/Pagination/Pagination';

interface Props {
  showFilters: boolean;
}

export const ProductsContainer: FunctionComponent<Props> = ({
  showFilters,
}) => {
  const productsCtx = useProducts();
  const { screenSize } = useSensor();

  const {
    variables,
    items,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    currencySymbol,
    currencyRate,
    totalPages,
    totalCount,
    minQueryLength,
    minQueryLengthReached,
    pageSizeOptions,
    setRoute,
    refineProduct,
  } = productsCtx;

  const goToPage = (page: number | string) => {
    if (typeof page === 'number') {
      setCurrentPage(page);
      handleUrlPagination(page);
    }
  };

  const onPageSizeChange = (pageSizeOption: number) => {
    setPageSize(pageSizeOption);
    handleUrlPageSize(pageSizeOption);
  };
  const translation = useContext(TranslationContext);

  if (!minQueryLengthReached) {
    const templateMinQueryText = translation.ProductContainers.minquery;
    const title = templateMinQueryText
      .replace('{variables.phrase}', variables.phrase)
      .replace('{minQueryLength}', minQueryLength);
    return (
      <div className="ds-sdk-min-query__page mx-auto max-w-8xl py-12 px-4 sm:px-6 lg:px-8">
        <Alert title={title} type="warning" description="" />
      </div>
    );
  }

  if (!totalCount) {
    return (
      <div className="ds-sdk-no-results__page mx-auto max-w-8xl py-12 px-4 sm:px-6 lg:px-8">
        <Alert
          title={translation.ProductContainers.noresults}
          type="warning"
          description=""
        />
      </div>
    );
  }
  return (
    <>
      <ProductList
        products={items}
        numberOfColumns={screenSize.columns}
        currencySymbol={currencySymbol}
        currencyRate={currencyRate}
        showFilters={showFilters}
        setRoute={setRoute}
        refineProduct={refineProduct}
      />
      <div
        className={`flex flex-row justify-between max-w-5xl lg:max-w-7xl ${
          showFilters ? 'mx-auto' : 'mr-auto'
        } w-full h-full`}
      >
        <div>
          {translation.ProductContainers.show}{' '}
          <PerPagePicker
            pageSizeOptions={pageSizeOptions}
            value={pageSize}
            onChange={onPageSizeChange}
          />{' '}
          {translation.ProductContainers.perPage}
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        )}
      </div>
    </>
  );
};
