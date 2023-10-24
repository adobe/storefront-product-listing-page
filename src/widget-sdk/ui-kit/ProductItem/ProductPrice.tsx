/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { Product, RefinedProduct } from '../../../types/interface';
import { getProductPrice } from '../../utils';

export interface ProductPriceProps {
  isComplexProductView: boolean;
  item: Product | RefinedProduct;
  discount: boolean | undefined;
  currencySymbol: string;
  currencyRate?: string;
}

export const ProductPrice: FunctionComponent<ProductPriceProps> = ({
  isComplexProductView,
  item,
  discount,
  currencySymbol,
  currencyRate,
}: ProductPriceProps) => {
  let price;
  if ('productView' in item) {
    price =
      item?.productView?.priceRange?.minimum?.final ??
      item?.productView?.price?.final;
  } else {
    price =
      item?.refineProduct?.priceRange?.minimum?.final ??
      item?.refineProduct?.price?.final;
  }
  return (
    <>
      {price && (
        <div className="ds-sdk-product-price">
          {!isComplexProductView && discount && (
            <p className="ds-sdk-product-price--discount mt-xs text-sm font-medium text-gray-900">
              <span className="line-through pr-2">
                {getProductPrice(
                  item,
                  currencySymbol,
                  currencyRate,
                  false,
                  false
                )}
              </span>
              <span className="text-secondary">
                {getProductPrice(
                  item,
                  currencySymbol,
                  currencyRate,
                  false,
                  true
                )}
              </span>
            </p>
          )}

          {!isComplexProductView && !discount && (
            <p className="ds-sdk-product-price--no-discount mt-xs text-sm font-medium text-gray-900">
              {getProductPrice(item, currencySymbol, currencyRate, false, true)}
            </p>
          )}

          {isComplexProductView && (
            <p className="ds-sdk-product-price--configurable mt-xs text-sm font-medium text-gray-900">
              <span className="text-gray-500 text-xs font-normal mr-xs">
                As low as
              </span>
              {discount ? (
                <>
                  <span className="line-through pr-2">
                    {getProductPrice(
                      item,
                      currencySymbol,
                      currencyRate,
                      false,
                      false
                    )}
                  </span>
                  <span className="text-secondary">
                    {getProductPrice(
                      item,
                      currencySymbol,
                      currencyRate,
                      false,
                      true
                    )}
                  </span>
                </>
              ) : (
                getProductPrice(item, currencySymbol, currencyRate, false, true)
              )}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default ProductPrice;
