/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import getSymbolFromCurrency from 'currency-symbol-map';

import { Product, RefinedProduct } from '../types/interface';

const getProductPrice = (
  product: Product | RefinedProduct,
  currencySymbol: string,
  currencyRate: string | undefined,
  useMaximum = false,
  useFinal = false
): string => {
  let priceType;
  let price;
  if ('product' in product) {
    priceType = product?.product?.price_range?.minimum_price;

    if (useMaximum) {
      priceType = product?.product?.price_range?.maximum_price;
    }

    price = priceType?.regular_price;
    if (useFinal) {
      price = priceType?.final_price;
    }
  } else {
    priceType =
      product?.refineProduct?.priceRange?.minimum ??
      product?.refineProduct?.price;

    if (useMaximum) {
      priceType = product?.refineProduct?.priceRange?.maximum;
    }

    price = priceType?.regular?.amount;
    if (useFinal) {
      price = priceType?.final?.amount;
    }
  }

  // if currency symbol is configurable within Commerce, that symbol is used
  let currency = price?.currency;

  if (currencySymbol) {
    currency = currencySymbol;
  } else {
    currency = getSymbolFromCurrency(currency) ?? '$';
  }

  const convertedPrice = currencyRate
    ? price?.value * parseFloat(currencyRate)
    : price?.value;

  return `${currency}${convertedPrice.toFixed(2)}`;
};

export { getProductPrice };
