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
import '../ProductItem/ProductPriceRange.css';
export interface ProductPriceRangeProps {
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

export const ProductPriceRange: FunctionComponent<ProductPriceRangeProps> = ({
  isComplexProductView,
  item,
  isBundle,
  isGrouped,
  isGiftCard,
  isConfigurable,
  discount,
  currencySymbol,
  currencyRate,
}: ProductPriceRangeProps) => {
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
        `${getProductPrice(item, currencySymbol, currencyRate, false, true)} `
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

    const getDiscountedPrice = () => {
        if ('product' in item) {
            if (item.product.price_range.maximum_price.final_price.value !== item.product.price_range.minimum_price.final_price.value) {
                const minPrice = item.product.price_range.minimum_price.regular_price.value - item.product.price_range.minimum_price.final_price.value > 0 ?
                    getProductPrice(item, currencySymbol, currencyRate, false, false) : '';
                const maxPrice = item.product.price_range.maximum_price.regular_price.value - item.product.price_range.maximum_price.final_price.value > 0 ?
                    getProductPrice(item, currencySymbol, currencyRate, true, false) : '';
                const originalPrice = ((minPrice !== '' || maxPrice !== '') ?
                    <span class="line-through text inline-block">
                    {minPrice} - {maxPrice} </span> : '');
                return <span className="price-text font-bold">
                   {getProductPrice(item, currencySymbol, currencyRate, false, true)}<span> - </span>
                    {getProductPrice(item, currencySymbol, currencyRate, true, true)}
                    {originalPrice}
                </span>;
            } else {
                return <span
                    class="price-text"> {getProductPrice(item, currencySymbol, currencyRate, false, true)}</span>;
            }
        }
        return '';
    };

  return (
    <>
      {price && (
        <div className="ds-sdk-product-price price-text pt-3.5">
          {!isBundle &&
            !isGrouped &&
            !isConfigurable &&
              !isComplexProductView &&
              discount && (
                  <p className="ds-sdk-product-price--discount my-auto text-center">
                <span className="price-text text-bold">
                  {getProductPrice(
                      item,
                      currencySymbol,
                      currencyRate,
                      false,
                      true
                  )}
                </span>
                      <span className="line-through text inline-block">
                  {getProductPrice(
                      item,
                      currencySymbol,
                      currencyRate,
                      false,
                      false
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
                    <p className="ds-sdk-product-price--no-discount my-auto text-center">
                        <span className="price-text">
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

          {isBundle && (
            <div className="ds-sdk-product-price--bundle">
              <p className="text-[0.875rem] font-medium text-gray-900 my-auto text-center">
                  {getDiscountedPrice()}
              </p>
            </div>
          )}

          {isGrouped && (
            <p className="ds-sdk-product-price--grouped text-[0.875rem] font-medium text-gray-900 my-auto text-center">
                {getDiscountedPrice()}
            </p>
          )}

          {isGiftCard && (
            <p className="ds-sdk-product-price--gift-card text-[0.875rem] font-medium text-gray-900 my-auto">
              {getPriceFormat(item, currencySymbol, currencyRate, true)}
            </p>
          )}

          {!isGrouped &&
            !isBundle &&
            (isConfigurable || isComplexProductView) && (
              <p className="ds-sdk-product-price--configurable text-[0.875rem] font-medium text-gray-900 my-auto text-center">
                {getDiscountedPrice()}
              </p>
            )}
        </div>
      )}
    </>
  );
};

export default ProductPriceRange;
