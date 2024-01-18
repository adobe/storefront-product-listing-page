/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { HTMLAttributes } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';

import './product-list.css';

import { Alert } from '../../components/Alert';
import { useProducts } from '../../context';
import { Product } from '../../types/interface';
import { classNames } from '../../utils/dom';
import ProductItem from '../ProductItem';

export interface ProductListProps extends HTMLAttributes<HTMLDivElement> {
  products: Array<Product> | null | undefined;
  numberOfColumns: number;
  showFilters: boolean;
}

export const ProductList: FunctionComponent<ProductListProps> = ({
  products,
  numberOfColumns,
  showFilters,
}) => {
  const productsCtx = useProducts();
  const { currencySymbol, currencyRate, setRoute, refineProduct, refreshCart } =
    productsCtx;
  const [cartUpdated, setCartUpdated] = useState(false);
  const [itemAdded, setItemAdded] = useState('');
  const [error, setError] = useState<boolean>(false);

  const className = showFilters ? 'max-w-full pl-3' : 'w-full mx-auto';

  useEffect(() => {
    refreshCart && refreshCart();
  }, [itemAdded]);

  return (
    <div
      className={classNames(
        'ds-sdk-product-list bg-body pb-2xl sm:pb-24',
        className
      )}
    >
      {cartUpdated && (
        <div className="mt-8">
          <Alert
            title={`You added ${itemAdded} to your shopping cart.`}
            type="success"
            description=""
            onClick={() => setCartUpdated(false)}
          />
        </div>
      )}
      {error && (
        <div className="mt-8">
          <Alert
            title={`Something went wrong trying to add an item to your cart.`}
            type="error"
            description=""
            onClick={() => setError(false)}
          />
        </div>
      )}
      <div
        style={{
          gridTemplateColumns: `repeat(${numberOfColumns}, minmax(0, 1fr))`,
        }}
        className="ds-sdk-product-list__grid mt-md grid grid-cols-1 gap-y-8 gap-x-2xl sm:grid-cols-2 md:grid-cols-3 xl:gap-x-8"
      >
        {products?.map((product) => (
          <ProductItem
            item={product}
            setError={setError}
            key={product?.productView?.id}
            currencySymbol={currencySymbol}
            currencyRate={currencyRate}
            setRoute={setRoute}
            refineProduct={refineProduct}
            setCartUpdated={setCartUpdated}
            setItemAdded={setItemAdded}
          />
        ))}
      </div>
    </div>
  );
};
