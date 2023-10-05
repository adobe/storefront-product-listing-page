import { FunctionComponent } from 'preact';

import { Product, RefinedProduct } from '../../types/interface';
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
  return (
    <div className="ds-sdk-product-price">
      {!isComplexProductView && discount && (
        <p className="ds-sdk-product-price--discount mt-xs text-sm font-medium text-gray-900">
          <span className="line-through pr-2">
            {getProductPrice(item, currencySymbol, currencyRate, false, false)}
          </span>
          <span className="text-secondary">
            {getProductPrice(item, currencySymbol, currencyRate, false, true)}
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
  );
};

export default ProductPrice;
