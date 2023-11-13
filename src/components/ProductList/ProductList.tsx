/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { HTMLAttributes } from 'preact/compat';

import './product-list.css';

import { Product, RedirectRouteFunc } from '../../types/interface';
import ProductItem from '../ProductItem';

export interface ProductListProps extends HTMLAttributes<HTMLDivElement> {
  products: Array<Product> | null | undefined;
  numberOfColumns: number;
  currencySymbol: string;
  currencyRate: string;
  showFilters: boolean;
  setRoute: RedirectRouteFunc | undefined;
  refineProduct: (optionIds: string[], sku: string) => any;
}

export const ProductList: FunctionComponent<ProductListProps> = ({
  products,
  numberOfColumns,
  currencySymbol,
  currencyRate,
  showFilters,
  setRoute,
  refineProduct,
}) => {
  const className = showFilters
    ? 'ds-sdk-product-list bg-body max-w-full pl-3 pb-2xl sm:pb-24'
    : 'ds-sdk-product-list bg-body w-full mx-auto pb-2xl sm:pb-24';
  return (
    <div className={className}>
      <div
        style={{
          gridTemplateColumns: `repeat(${numberOfColumns}, minmax(0, 1fr))`,
        }}
        className="ds-sdk-product-list__grid mt-md grid grid-cols-1 gap-y-8 gap-x-2xl sm:grid-cols-2 md:grid-cols-3 xl:gap-x-8"
      >
        {products?.map((product) => (
          <ProductItem
            item={product}
            key={product?.productView?.id}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
            setRoute={setRoute}
            refineProduct={refineProduct}
          />
        ))}
      </div>
    </div>
  );
};
