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

  if ('product' in item) {
    price =
      item?.product?.price_range?.minimum_price?.final_price ??
      item?.product?.price_range?.minimum_price?.regular_price;
  } else {
    price =
      item?.refineProduct?.priceRange?.minimum?.final ??
      item?.refineProduct?.price?.final;
  }
  const getBundledPrice = (
    item: Product | RefinedProduct,
    currencySymbol: string,
    currencyRate: string | undefined
  ) => {
    const bundlePriceTranslationOrder =
      translation.ProductCard.bundlePrice.split(' ');
    return bundlePriceTranslationOrder.map((word: string, index: any) =>
      word === '{fromBundlePrice}' ? (
        getProductPrice(item, currencySymbol, currencyRate, false, true)
      ) : word === '{toBundlePrice}' ? (
        getProductPrice(item, currencySymbol, currencyRate, true, true)
      ) : (
        <span className="text-gray-500 text-xs font-normal mr-xs" key={index}>
          {word}
        </span>
      )
    );
  };

  const getPriceFormat = (
    item: Product | RefinedProduct,
    currencySymbol: string,
    currencyRate: string | undefined,
    isGiftCard: boolean
  ) => {
    const priceTranslation = isGiftCard
      ? translation.ProductCard.from
      : translation.ProductCard.startingAt;
    const startingAtTranslationOrder = priceTranslation.split('{productPrice}');
    return startingAtTranslationOrder.map((word: string, index: any) =>
      word === '' ? (
        getProductPrice(item, currencySymbol, currencyRate, false, true)
      ) : (
        <span className="text-gray-500 text-xs font-normal mr-xs" key={index}>
          {word}
        </span>
      )
    );
  };

  const getDiscountedPrice = (discount: boolean | undefined) => {
    const discountPrice = discount ? (
      <>
        <span className="line-through pr-2">
          {getProductPrice(item, currencySymbol, currencyRate, false, false)}
        </span>
        <span className="text-secondary">
          {getProductPrice(item, currencySymbol, currencyRate, false, true)}
        </span>
      </>
    ) : (
      getProductPrice(item, currencySymbol, currencyRate, false, true)
    );
    const discountedPriceTranslation = translation.ProductCard.asLowAs;
    const discountedPriceTranslationOrder =
      discountedPriceTranslation.split('{discountPrice}');
    return discountedPriceTranslationOrder.map((word: string, index: any) =>
      word === '' ? (
        discountPrice
      ) : (
        <span className="text-gray-500 text-xs font-normal mr-xs" key={index}>
          {word}
        </span>
      )
    );
  };

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
                {getBundledPrice(item, currencySymbol, currencyRate)}
              </p>
            </div>
          )}

          {isGrouped && (
            <p className="ds-sdk-product-price--grouped mt-xs text-sm font-medium text-gray-900">
              {getPriceFormat(item, currencySymbol, currencyRate, false)}
            </p>
          )}

          {isGiftCard && (
            <p className="ds-sdk-product-price--gift-card mt-xs text-sm font-medium text-gray-900">
              {getPriceFormat(item, currencySymbol, currencyRate, true)}
            </p>
          )}

          {!isGrouped &&
            !isBundle &&
            (isConfigurable || isComplexProductView) && (
              <p className="ds-sdk-product-price--configurable mt-xs text-sm font-medium text-gray-900">
                {getDiscountedPrice(discount)}
              </p>
            )}
        </div>
      )}
    </>
  );
};

export default ProductPrice;
