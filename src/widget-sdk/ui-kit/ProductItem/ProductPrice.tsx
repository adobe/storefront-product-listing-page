import { getProductPrice } from '../../utils';
import { FunctionComponent } from 'preact';

import { Product } from '../../types/interface';

export interface ProductPriceProps {
  isBundle: boolean;
  isGrouped: boolean;
  isGiftCard: boolean;
  isConfigurable: boolean;
  item: Product;
  discount: boolean | undefined;
  currencySymbol: string;
  currencyRate?: string;
}

export const ProductPrice: FunctionComponent<ProductPriceProps> = ({
  isBundle,
  isGrouped,
  isGiftCard,
  isConfigurable,
  item,
  discount,
  currencySymbol,
  currencyRate,
}: ProductPriceProps) => {
  return (
    <div className="ds-sdk-product-price">
      {!isBundle && !isGrouped && !isConfigurable && discount && (
        <p className="ds-sdk-product-price--discount mt-xs text-sm font-medium text-gray-900">
          <span className="line-through pr-2">
            {getProductPrice(item, currencySymbol, currencyRate, false, false)}
          </span>
          <span className="text-secondary">
            {getProductPrice(item, currencySymbol, currencyRate, false, true)}
          </span>
        </p>
      )}

      {!isBundle &&
        !isGrouped &&
        !isGiftCard &&
        !isConfigurable &&
        !discount && (
          <p className="ds-sdk-product-price--no-discount mt-xs text-sm font-medium text-gray-900">
            {getProductPrice(item, currencySymbol, currencyRate, false, true)}
          </p>
        )}

      {isBundle && (
        <div className="ds-sdk-product-price--bundle">
          <p className="mt-xs text-sm font-medium text-gray-900">
            <span className="text-gray-500 text-xs font-normal mr-xs">
              From
            </span>
            {getProductPrice(item, currencySymbol, currencyRate, false, true)}
          </p>
          <p className="mt-xs text-sm font-medium text-gray-900">
            <span className="text-gray-500 text-xs font-normal mr-xs">To</span>
            {getProductPrice(item, currencySymbol, currencyRate, true, true)}
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
          <span className="text-gray-500 text-xs font-normal mr-xs">From</span>
          {getProductPrice(item, currencySymbol, currencyRate, false, true)}
        </p>
      )}

      {isConfigurable && (
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
  );
};

export default ProductPrice;
