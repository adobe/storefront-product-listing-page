import { SwatchButton } from '../../ui-kit';
import { FunctionComponent } from 'preact';

import NoImage from '../../icons/NoImage.svg';
import { Product } from '../../types/interface';
import {
  getProductImageURL,
  htmlStringDecode,
  SEARCH_UNIT_ID,
} from '../../utils';
import ProductPrice from './ProductPrice';

export interface ProductProps {
  item: Product;
  currencySymbol: string;
  currencyRate?: string;
}

export const ProductItem: FunctionComponent<ProductProps> = ({
  item,
  currencySymbol,
  currencyRate,
}: ProductProps) => {
  const { productView } = item;

  const productImage = getProductImageURL(item, 'small'); // get "small" image for PLP
  console.log('product', productView);

  // const discount: boolean =
  //   !!product?.price_range?.minimum_price?.discount?.amount_off ||
  //   !!product?.price_range?.minimum_price?.discount?.percent_off ||
  //   product?.price_range?.minimum_price?.regular_price?.value >
  //     product?.price_range?.minimum_price?.final_price?.value;

  // will have to figure out discount logic for amount_off and percent_off still
  const discount: boolean =
    productView?.priceRange?.minimum?.regular?.amount?.value >
    productView?.priceRange?.minimum?.final?.amount?.value;
  const isBundle = productView?.__typename === 'BundleProduct';
  const isGrouped = productView?.__typename === 'GroupedProduct';
  const isGiftCard = productView?.__typename === 'GiftCardProduct';
  const isConfigurable = productView?.__typename === 'ConfigurableProduct';
  console.log(productView.options?.values);

  const onProductClick = () => {
    window.magentoStorefrontEvents?.publish.searchProductClick(
      SEARCH_UNIT_ID,
      productView.sku
    );
  };

  return (
    <div className="ds-sdk-product-item group relative flex flex-col justify-between h-full">
      <a
        href={productView?.url as string}
        onClick={onProductClick}
        className="!text-primary hover:no-underline hover:text-primary"
      >
        <div className="ds-sdk-product-item group relative flex flex-col justify-between h-full">
          <div className="ds-sdk-product-item__image relative w-full h-full rounded-md overflow-hidden group-hover:opacity-75">
            {/*
                  NOTE:
                  we could use <picture> <source...
                  or srcset in <img /> for  breakpoint based img file
                  in future for better performance
                 */}
            {productImage ? (
              <div class="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-96">
                <img
                  src={productImage}
                  alt={productView.name}
                  loading="eager"
                  className="max-h-[30rem] h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
            ) : (
              <NoImage className="max-h-[30rem] h-full w-full object-cover object-center lg:h-full lg:w-full" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="ds-sdk-product-item__product-name mt-md text-sm text-primary">
              {htmlStringDecode(productView.name)}
            </div>
            <ProductPrice
              item={item}
              isBundle={isBundle}
              isGrouped={isGrouped}
              isGiftCard={isGiftCard}
              isConfigurable={isConfigurable}
              discount={discount}
              currencySymbol={currencySymbol}
              currencyRate={currencyRate}
            />
          </div>
        </div>
      </a>
      <div className="ds-sdk-product-item__product-swatch flex flex-row mt-sm text-sm text-primary">
        {productView.options?.map((swatches) =>
          swatches.values?.map(
            (swatch) =>
              swatch.type == 'COLOR_HEX' && (
                <div className="ds-sdk-product-item__product-price text-sm text-primary mr-sm">
                  <SwatchButton
                    key={productView.name}
                    value={swatch.value ?? ''}
                    type={swatch.type}
                    checked={true}
                    // eslint-disable-next-line no-console
                    onClick={() => {
                      // eslint-disable-next-line no-console
                      console.log('here');
                      console.log(productView.options ?? '');
                    }}
                  />
                </div>
              )
          )
        )}
      </div>
    </div>
  );
};

export default ProductItem;
