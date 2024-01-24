/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';

import { useCart, useWidgetConfig } from '../../context';
import NoImage from '../../icons/NoImage.svg';
import {
  Product,
  ProductViewMedia,
  RedirectRouteFunc,
  RefinedProduct,
} from '../../types/interface';
import { SEARCH_UNIT_ID } from '../../utils/constants';
import { useFloodgateFlags } from '../../utils/Floodgate';
import { getProductImageURLs } from '../../utils/getProductImage';
import { htmlStringDecode } from '../../utils/htmlStringDecode';
import { AddToCartButton } from '../AddToCartButton';
import { ImageCarousel } from '../ImageCarousel';
import { SwatchButtonGroup } from '../SwatchButtonGroup';
import WishlistButton from '../WishlistButton';
import ProductPrice from './ProductPrice';

export interface ProductProps {
  item: Product;
  currencySymbol: string;
  currencyRate?: string;
  setRoute?: RedirectRouteFunc | undefined;
  refineProduct: (optionIds: string[], sku: string) => any;
  setCartUpdated: (cartUpdated: boolean) => void;
  setItemAdded: (itemAdded: string) => void;
  setError: (error: boolean) => void;
}

export const ProductItem: FunctionComponent<ProductProps> = ({
  item,
  currencySymbol,
  currencyRate,
  setRoute,
  refineProduct,
  setCartUpdated,
  setItemAdded,
  setError,
}: ProductProps) => {
  const flags = useFloodgateFlags();
  const { addToCart, refreshCart } = useCart();
  const widgetConfig = useWidgetConfig();

  const { product, productView } = item;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedSwatch, setSelectedSwatch] = useState('');
  const [imagesFromRefinedProduct, setImagesFromRefinedProduct] = useState<
    ProductViewMedia[] | null
  >();
  const [refinedProduct, setRefinedProduct] = useState<RefinedProduct>();
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const handleSelection = async (optionIds: string[], sku: string) => {
    const data = await refineProduct(optionIds, sku);
    setSelectedSwatch(optionIds[0]);
    setImagesFromRefinedProduct(data.refineProduct.images);
    setRefinedProduct(data);
    setCarouselIndex(0);
  };

  const isSelected = (id: string) => {
    const selected = selectedSwatch ? selectedSwatch === id : false;
    return selected;
  };

  const productImageArray = imagesFromRefinedProduct
    ? getProductImageURLs(imagesFromRefinedProduct ?? [])
    : getProductImageURLs(
        productView.images ?? [],
        product.image?.url ?? undefined
      );

  // will have to figure out discount logic for amount_off and percent_off still
  const discount: boolean = refinedProduct
    ? refinedProduct.refineProduct?.priceRange?.minimum?.regular?.amount
        ?.value >
      refinedProduct.refineProduct?.priceRange?.minimum?.final?.amount?.value
    : product?.price_range?.minimum_price?.regular_price?.value >
        product?.price_range?.minimum_price?.final_price?.value ||
      productView?.price?.regular?.amount?.value >
        productView?.price?.final?.amount?.value;
  const isSimple = product?.__typename === 'SimpleProduct';
  const isComplexProductView = productView?.__typename === 'ComplexProductView';
  const isBundle = product?.__typename === 'BundleProduct';
  const isGrouped = product?.__typename === 'GroupedProduct';
  const isGiftCard = product?.__typename === 'GiftCardProduct';
  const isConfigurable = product?.__typename === 'ConfigurableProduct';

  const onProductClick = () => {
    window.magentoStorefrontEvents?.publish.searchProductClick(
      SEARCH_UNIT_ID,
      product?.sku
    );
  };

  const productUrl = setRoute
    ? setRoute({ sku: productView?.sku })
    : product?.canonical_url;

  const handleAddToCart = async () => {
    setError(false);
    if (isSimple) {
      const response = await addToCart(productView.sku);

      if (
        response?.errors ||
        response?.data?.addProductsToCart?.user_errors.length > 0
      ) {
        setError(true);
        return;
      }

      setItemAdded(product.name);
      refreshCart && refreshCart();
      setCartUpdated(true);
    } else if (productUrl) {
      window.open(productUrl, '_self');
    }
  };

  return (
    <div
      className="ds-sdk-product-item group relative flex flex-col max-w-sm justify-between h-full hover:border-[1.5px] border-solid hover:shadow-lg border-offset-2 p-2"
      style={{
        'border-color': '#D5D5D5',
      }}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
    >
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
         or srcset in <img /> for breakpoint based img file
         in future for better performance
         */}
            {productImageArray.length ? (
              <ImageCarousel
                images={productImageArray}
                productName={product.name}
                carouselIndex={carouselIndex}
                setCarouselIndex={setCarouselIndex}
              />
            ) : (
              <NoImage
                className={`max-h-[45rem] w-full object-cover object-center lg:w-full`}
              />
            )}
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <div className="ds-sdk-product-item__product-name mt-md text-sm text-primary">
                {productView.name !== null &&
                  htmlStringDecode(productView.name)}
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
            {flags.addToWishlist && widgetConfig.addToWishlist.enabled && (
              // TODO: Remove flag during phase 3 MSRCH-4278
              <div className="ds-sdk-wishlist ml-auto mt-md">
                <WishlistButton
                  productSku={item.product.sku}
                  type={widgetConfig.addToWishlist.placement}
                />
              </div>
            )}
          </div>
        </div>
      </a>

      {productView?.options && productView.options?.length > 0 && (
        <div className="ds-sdk-product-item__product-swatch flex flex-row mt-sm text-sm text-primary pb-6">
          {productView?.options?.map(
            (swatches) =>
              swatches.id == 'color' && (
                <SwatchButtonGroup
                  key={product?.sku}
                  isSelected={isSelected}
                  swatches={swatches.values ?? []}
                  showMore={onProductClick}
                  productUrl={productUrl as string}
                  onClick={handleSelection}
                  sku={product?.sku}
                />
              )
          )}
        </div>
      )}
      {widgetConfig.addToCart.enabled && (
        <div className="pb-4 h-[38px]">
          {isHovering && <AddToCartButton onClick={handleAddToCart} />}
        </div>
      )}
    </div>
  );
};

export default ProductItem;
