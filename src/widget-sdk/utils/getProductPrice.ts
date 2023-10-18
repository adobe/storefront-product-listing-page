/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import getSymbolFromCurrency from 'currency-symbol-map';

import { Product, RefinedProduct } from '../../types/interface';

const getProductPrice = (
  product: Product | RefinedProduct,
  currencySymbol: string,
  currencyRate: string | undefined,
  useMaximum = false,
  useFinal = false
): string => {
  let priceType;
  if ('productView' in product) {
    priceType =
      product?.productView?.priceRange?.minimum ?? product?.productView?.price;
  } else {
    priceType =
      product?.refineProduct?.priceRange?.minimum ??
      product?.refineProduct?.price;
  }
  if (useMaximum) {
    if ('productView' in product) {
      priceType = product?.productView?.priceRange?.maximum;
    } else {
      priceType = product?.refineProduct?.priceRange?.maximum;
    }
  }

  let price = priceType?.regular;
  if (useFinal) {
    price = priceType?.final;
  }

  // if currency symbol is configurable within Commerce, that symbol is used
  let currency = price?.amount?.currency;

  if (currencySymbol) {
    currency = currencySymbol;
  } else {
    currency = getSymbolFromCurrency(currency) ?? '$';
  }

  const convertedPrice = currencyRate
    ? price?.amount?.value * parseFloat(currencyRate)
    : price?.amount?.value;

  return `${currency}${convertedPrice.toFixed(2)}`;
};

export { getProductPrice };
