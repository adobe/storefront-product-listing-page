import getSymbolFromCurrency from "currency-symbol-map";

import { Product } from "../types/interface";

const getProductPrice = (
    product: Product,
    currencySymbol: string,
    currencyRate: string | undefined,
    useMaximum = false,
    useFinal = false,
): string => {
    let priceType = product?.product?.price_range?.minimum_price;
    if (useMaximum) {
        priceType = product?.product?.price_range?.maximum_price;
    }

    let price = priceType?.regular_price;
    if (useFinal) {
        price = priceType?.final_price;
    }

    // if currency symbol is configurable within Magento, that symbol is used
    let currency = price?.currency;

    if (currencySymbol) {
        currency = currencySymbol;
    } else {
        currency = getSymbolFromCurrency(currency) ?? "$";
    }

    if (price?.value === null) {
        return `${currency}0`;
    }

    const convertedPrice = currencyRate
        ? price?.value * parseFloat(currencyRate)
        : price?.value;

    return `${currency}${convertedPrice.toFixed(2)}`;
};

export { getProductPrice };
