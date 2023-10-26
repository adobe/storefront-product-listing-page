/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useContext } from 'preact/hooks';

import { TranslationContext } from '../../context/translation';
import { Product, RefinedProduct } from '../../types/interface';
import { getProductPrice } from '../../utils/getProductPrice';

export interface ProductPriceProps {
  isComplexProductView: boolean;
  item: Product | RefinedProduct;
  isBundle: boolean;
  isGrouped: boolean;
  isGiftCard: boolean;
  isConfigurable: boolean;
  discount: boolean | undefined;
  currencySymbol: string;
  currencyRate?: string;
}

export const ProductPrice: FunctionComponent<ProductPriceProps> = ({
  isComplexProductView,
  item,
  isBundle,
  isGrouped,
  isGiftCard,
  isConfigurable,
  discount,
  currencySymbol,
  currencyRate,
}: ProductPriceProps) => {
  const translation = useContext(TranslationContext);
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
          {!isBundle &&
            !isGrouped &&
            !isConfigurable &&
            !isComplexProductView &&
            discount && (
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

          {!isBundle &&
            !isGrouped &&
            !isGiftCard &&
            !isConfigurable &&
            !isComplexProductView &&
            !discount && (
              <p className="ds-sdk-product-price--no-discount mt-xs text-sm font-medium text-gray-900">
                {getProductPrice(
                  item,
                  currencySymbol,
                  currencyRate,
                  false,
                  true
                )}
              </p>
            )}

          {isBundle && (
            <div className="ds-sdk-product-price--bundle">
              <p className="mt-xs text-sm font-medium text-gray-900">
                <span className="text-gray-500 text-xs font-normal mr-xs">
                  From
                </span>
                {getProductPrice(
                  item,
                  currencySymbol,
                  currencyRate,
                  false,
                  true
                )}
              </p>
              <p className="mt-xs text-sm font-medium text-gray-900">
                <span className="text-gray-500 text-xs font-normal mr-xs">
                  To
                </span>
                {getProductPrice(
                  item,
                  currencySymbol,
                  currencyRate,
                  true,
                  true
                )}
              </p>
            </div>
          )}

          {isGrouped && (
            <p className="ds-sdk-product-price--grouped mt-xs text-sm font-medium text-gray-900">
              <span className="text-gray-500 text-xs font-normal mr-xs">
                Starting at
              </span>
              {getProductPrice(item, currencySymbol, currencyRate, false, true)}
            </p>
          )}

          {isGiftCard && (
            <p className="ds-sdk-product-price--gift-card mt-xs text-sm font-medium text-gray-900">
              <span className="text-gray-500 text-xs font-normal mr-xs">
                From
              </span>
              {getProductPrice(item, currencySymbol, currencyRate, false, true)}
            </p>
          )}

          {!isGrouped &&
            !isBundle &&
            (isConfigurable || isComplexProductView) && (
              <p className="ds-sdk-product-price--configurable mt-xs text-sm font-medium text-gray-900">
                <span className="text-gray-500 text-xs font-normal mr-xs">
                  {translation.ProductCard.asLowAs}
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
                  getProductPrice(
                    item,
                    currencySymbol,
                    currencyRate,
                    false,
                    true
                  )
                )}
              </p>
            )}
        </div>
      )}
    </>
  );
};

export default ProductPrice;
