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
        <span
          className="text-brand-600 font-headline-4-default mr-xs"
          key={index}
        >
          {getProductPrice(item, currencySymbol, currencyRate, false, true)}
        </span>
      ) : word === '{toBundlePrice}' ? (
        <span
          className="text-brand-600 font-headline-4-default mr-xs"
          key={index}
        >
          {getProductPrice(item, currencySymbol, currencyRate, true, true)}
        </span>
      ) : (
        <span
          className="text-brand-300 font-headline-4-default mr-xs"
          key={index}
        >
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
        <span
          className="text-brand-300 font-details-caption-3 mr-xs"
          key={index}
        >
          {word}
        </span>
      )
    );
  };

  const getDiscountedPrice = (discount: boolean | undefined) => {
    const discountPrice = discount ? (
      <>
        <span className="line-through pr-2 text-brand-300">
          {getProductPrice(item, currencySymbol, currencyRate, false, false)}
        </span>
        <span className="font-headline-4-strong">
          {getProductPrice(item, currencySymbol, currencyRate, false, true)}
        </span>
      </>
    ) : (
      getProductPrice(item, currencySymbol, currencyRate, false, true)
    );
    const discountedPriceTranslation = translation.ProductCard.asLowAs;
    const discountedPriceTranslationOrder =
      discountedPriceTranslation.split('{discountPrice}');
    return discountPrice;
    // return discountedPriceTranslationOrder.map((word: string, index: any) =>
    //   word === '' ? (
    //     discountPrice
    //   ) : (
    //     <span
    //       className="text-brand-300 font-headline-4-default mr-xs"
    //       key={index}
    //     >
    //       {word}
    //     </span>
    //   )
    // );
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
              <p className="ds-sdk-product-price--discount mt-xs font-headline-4-strong">
                <span className="line-through pr-2 text-brand-300">
                  {getProductPrice(
                    item,
                    currencySymbol,
                    currencyRate,
                    false,
                    false
                  )}
                </span>
                <span className="text-brand-600">
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
              <p className="ds-sdk-product-price--no-discount mt-xs font-headline-4-strong">
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
              <p className="mt-xs font-headline-4-default">
                {getBundledPrice(item, currencySymbol, currencyRate)}
              </p>
            </div>
          )}

          {isGrouped && (
            <p className="ds-sdk-product-price--grouped mt-xs font-headline-4-strong">
              {getPriceFormat(item, currencySymbol, currencyRate, false)}
            </p>
          )}

          {isGiftCard && (
            <p className="ds-sdk-product-price--gift-card mt-xs font-headline-4-strong">
              {getPriceFormat(item, currencySymbol, currencyRate, true)}
            </p>
          )}

          {!isGrouped &&
            !isBundle &&
            (isConfigurable || isComplexProductView) && (
              <p className="ds-sdk-product-price--configurable mt-xs font-headline-4-strong">
                {getDiscountedPrice(discount)}
              </p>
            )}
        </div>
      )}
    </>
  );
};

export default ProductPrice;
