/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';

import NoImage from '../../icons/NoImage.svg';
import {
  Product,
  ProductViewMedia,
  RedirectRouteFunc,
  RefinedProduct,
} from '../../types/interface';
import { SEARCH_UNIT_ID } from '../../utils/constants';
import { getProductImageURL } from '../../utils/getProductImage';
import { htmlStringDecode } from '../../utils/htmlStringDecode';
import { SwatchButtonGroup } from '../SwatchButtonGroup';
import ProductPrice from './ProductPrice';

export interface ProductProps {
  item: Product;
  currencySymbol: string;
  currencyRate?: string;
  setRoute?: RedirectRouteFunc | undefined;
  refineProduct: (optionIds: string[], sku: string) => any;
}

export const ProductItem: FunctionComponent<ProductProps> = ({
  item,
  currencySymbol,
  currencyRate,
  setRoute,
  refineProduct,
}: ProductProps) => {
  const { product, productView } = item;
  const [selectedSwatch, setSelectedSwatch] = useState('');
  const [productImages, setImages] = useState<ProductViewMedia[] | null>();
  const [refinedProduct, setRefinedProduct] = useState<RefinedProduct>();

  const handleSelection = async (optionIds: string[], sku: string) => {
    const data = await refineProduct(optionIds, sku);
    setSelectedSwatch(optionIds[0]);
    setImages(data.refineProduct.images);
    setRefinedProduct(data);
  };

  const isSelected = (id: string) => {
    const selected = selectedSwatch ? selectedSwatch === id : false;
    return selected;
  };

  const productImage = getProductImageURL(
    productImages ? productImages ?? [] : productView.images ?? []
  ); // get image for PLP

  // will have to figure out discount logic for amount_off and percent_off still
  const discount: boolean = refinedProduct
    ? refinedProduct.refineProduct?.priceRange?.minimum?.regular?.amount
        ?.value >
      refinedProduct.refineProduct?.priceRange?.minimum?.final?.amount?.value
    : productView?.priceRange?.minimum?.regular?.amount?.value >
        productView?.priceRange?.minimum?.final?.amount?.value ||
      productView?.price?.regular?.amount?.value >
        productView?.price?.final?.amount?.value;
  const isComplexProductView = productView?.__typename === 'ComplexProductView';
  const isBundle = product?.__typename === 'BundleProduct';
  const isGrouped = product?.__typename === 'GroupedProduct';
  const isGiftCard = product?.__typename === 'GiftCardProduct';
  const isConfigurable = product?.__typename === 'ConfigurableProduct';

  const onProductClick = () => {
    window.magentoStorefrontEvents?.publish.searchProductClick(
      SEARCH_UNIT_ID,
      productView?.sku
    );
  };

  const productUrl = setRoute
    ? setRoute({ sku: productView?.sku })
    : product?.canonical_url;

  return (
    <div className="ds-sdk-product-item group relative flex flex-col max-w-sm justify-between h-full">
      <a
        href={productUrl as string}
        onClick={onProductClick}
        className="!text-primary hover:no-underline hover:text-primary"
      >
        <div className="ds-sdk-product-item__main relative flex flex-col justify-between h-full">
          <div className="ds-sdk-product-item__image relative w-full h-full rounded-md overflow-hidden">
            {/*
                  NOTE:
                  we could use <picture> <source...
                  or srcset in <img /> for  breakpoint based img file
                  in future for better performance
                 */}
            {productImage ? (
              <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none">
                <img
                  src={productImage}
                  alt={productView.name}
                  loading="eager"
                  className="max-h-[45rem] h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
            ) : (
              <NoImage
                className={`max-h-[45rem] w-full object-cover object-center lg:w-full`}
              />
            )}
          </div>
          <div className="flex flex-col">
            <div className="ds-sdk-product-item__product-name mt-md text-sm text-primary">
              {htmlStringDecode(productView.name)}
            </div>
            <ProductPrice
              item={refinedProduct ?? item}
              isBundle={isBundle}
              isGrouped={isGrouped}
              isGiftCard={isGiftCard}
              isConfigurable={isConfigurable}
              isComplexProductView={isComplexProductView}
              discount={discount}
              currencySymbol={currencySymbol}
              currencyRate={currencyRate}
            />
          </div>
        </div>
      </a>
      <div className="ds-sdk-product-item__product-swatch flex flex-row mt-sm text-sm text-primary pb-6">
        {productView?.options?.map(
          (swatches) =>
            swatches.id == 'color' && (
              <SwatchButtonGroup
                key={productView?.sku}
                isSelected={isSelected}
                swatches={swatches.values ?? []}
                showMore={onProductClick}
                productUrl={productUrl as string}
                onClick={handleSelection}
                sku={productView?.sku}
              />
            )
        )}
      </div>
    </div>
  );
};

export default ProductItem;
