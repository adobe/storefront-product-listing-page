/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';

import '../ProductItem/ProductItem.css';

import { useCart, useProducts, useSensor, useStore } from '../../context';
import NoImage from '../../icons/NoImage.svg';
import {
  Product,
  ProductViewMedia,
  RedirectRouteFunc,
  RefinedProduct,
  SwatchValues
} from '../../types/interface';
import { SEARCH_UNIT_ID } from '../../utils/constants';
import {
  generateOptimizedImages,
  getProductImagesFromAttribute,
  getProductImageURLs
} from '../../utils/getProductImage';
import { htmlStringDecode } from '../../utils/htmlStringDecode';
import { isSportsWear } from '../../utils/productUtils';
import { AddToCartButton } from '../AddToCartButton';
import ImageHover from '../ImageHover';
import { SwatchButtonGroup } from '../SwatchButtonGroup';
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
  addToCart?: (
    sku: string,
    options: string[],
    quantity: number
  ) => Promise<void | undefined>;
}

const SWATCH_COLORS = 'Colors';
const SWATCH_COLORS_TEAM = 'Colors / Team';
const SWATCH_COLORS_TEAM_NAME = 'Colors / Team name';
const SWATCH_SIZE = 'Size';

export const ProductItem: FunctionComponent<ProductProps> = ({
  item,
  currencySymbol,
  currencyRate,
  setRoute,
  refineProduct,
  setCartUpdated,
  setItemAdded,
  setError,
  addToCart,
}: ProductProps) => {
  const { product, productView } = item;
  const [selectedSwatch, setSelectedSwatch] = useState('');
  const [imagesFromRefinedProduct, setImagesFromRefinedProduct] = useState<
    ProductViewMedia[] | null
  >();
  const [refinedProduct, setRefinedProduct] = useState<RefinedProduct>();
  const [isHovering, setIsHovering] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const { addToCartGraphQL, refreshCart } = useCart();
  const { viewType } = useProducts();
  const {
    config: { optimizeImages, imageBaseWidth, listview },
  } = useStore();

  const { screenSize } = useSensor();

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
    setShowSizes(false);
  };

  const handleSelection = async (optionIds: string[], sku: string) => {
    const data = await refineProduct(optionIds, sku);
    setSelectedSwatch(optionIds[0]);
    setImagesFromRefinedProduct(data.refineProduct.images);
    setRefinedProduct(data);
  };

  const isSelected = (id: string) => {
    const selected = selectedSwatch ? selectedSwatch === id : false;
    return selected;
  };

  const productImageArray = imagesFromRefinedProduct
    ? getProductImageURLs(imagesFromRefinedProduct ?? [], 2)
    : getProductImagesFromAttribute(item);
    
  let optimizedImageArray: { src: string; srcset: any }[] = [];

  if (optimizeImages) {
    optimizedImageArray = generateOptimizedImages(
      productImageArray,
      imageBaseWidth ?? 200
    );
  }

  // will have to figure out discount logic for amount_off and percent_off still
  const discount: boolean = refinedProduct
    ? refinedProduct.refineProduct?.priceRange?.minimum?.regular?.amount
        ?.value >
      refinedProduct.refineProduct?.priceRange?.minimum?.final?.amount?.value
    : product?.price_range?.minimum_price?.regular_price?.value >
        product?.price_range?.minimum_price?.final_price?.value ||
      productView?.price?.regular?.amount?.value >
        productView?.price?.final?.amount?.value;

  const isComplexProductView = productView?.__typename === 'ComplexProductView';
  const isBundle = product?.__typename === 'BundleProduct';
  const isGrouped = product?.__typename === 'GroupedProduct';
  const isGiftCard = product?.__typename === 'GiftCardProduct';
  const isConfigurable = product?.__typename === 'ConfigurableProduct';
  const shouldShowAddToBagButton = isSportsWear(item) && (!screenSize.desktop || isHovering) && !showSizes;

  const onProductClick = () => {
    window.adobeDataLayer.push((dl: any) => {
      dl.push({
        event: 'search-product-click',
        eventInfo: {
          ...dl.getState(),
          sku: product?.sku,
          searchUnitId: SEARCH_UNIT_ID,
        },
      });
    });
  };

  const productUrl = setRoute
    ? setRoute({ sku: productView?.sku, urlKey: productView?.urlKey })
    : product?.canonical_url;

  const updateCart = async (selectedVariants: string[] = []) => {
    setError(false);
    if (addToCart) {
      //Custom add to cart function passed in
      await addToCart(productView.sku, selectedVariants, 1);
    } else {
      // Add to cart using GraphQL & Luma extension
      const response = await addToCartGraphQL(productView.sku, selectedVariants);

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
    }
  }

  const handleAddToCart = async (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();

    const hasSizeOptions = productView?.options?.some((swatches) => swatches.title === SWATCH_SIZE);
    if ((!listview || viewType !== 'listview') && hasSizeOptions) {
      setShowSizes(true);
      return;
    }

    const selectedVariants = selectedSwatch ? [selectedSwatch] : [];
    updateCart(selectedVariants);
  };

  const handleSizeSelection = async (optionIds: string[]) => {
    setShowSizes(false);

    let selectedVariants = selectedSwatch ? [selectedSwatch] : [];
    if (optionIds) {
      selectedVariants = [...selectedVariants, ...optionIds];
    }

    updateCart(selectedVariants);
  };

  if (listview && viewType === 'listview') {
    return (
      <>
        <div className="grid-container">
          <div
            className={`product-image ds-sdk-product-item__image relative overflow-hidden}`}
          >
            <a
              href={productUrl as string}
              onClick={onProductClick}
              className="!text-brand-700 hover:no-underline hover:text-brand-700"
            >
              {/* Image */}
              {productImageArray.length ? (
                <ImageHover
                  images={
                    optimizedImageArray.length
                      ? optimizedImageArray
                      : productImageArray
                  }
                  // productName={product.name}
                />
              ) : (
                <NoImage
                  className={`max-h-[250px] max-w-[200px] pr-5 m-auto object-cover object-center lg:w-full`}
                />
              )}
            </a>
          </div>
          <div className="product-details">
            <div className="flex flex-col w-1/3 p-2">
              {/* Product name */}
              <a
                href={productUrl as string}
                onClick={onProductClick}
                className="!text-brand-700 hover:no-underline hover:text-brand-700"
              >
                <div className="ds-sdk-product-item__product-name mt-xs text-sm text-brand-700">
                  {product.name !== null && htmlStringDecode(product.name)}
                </div>
                <div className="ds-sdk-product-item__product-sku mt-xs text-sm text-brand-700">
                  SKU:
                  {product.sku !== null && htmlStringDecode(product.sku)}
                </div>
              </a>

              {/* Swatch */}
              <div className="ds-sdk-product-item__product-swatch flex flex-row mt-sm text-sm text-brand-700 pb-6">
                {productView?.options?.map(
                  (swatches) => {
                      // swatches.id === 'color' && (
                     return swatches.title === SWATCH_COLORS && (
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
                  }
                )}
              </div>
            </div>
          </div>
          <div className="product-price">
            <a
              href={productUrl as string}
              onClick={onProductClick}
              className="!text-brand-700 hover:no-underline hover:text-brand-700"
            >
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
            </a>
          </div>
          <div className="product-description text-sm text-brand-700 mt-xs">
            <a
              href={productUrl as string}
              onClick={onProductClick}
              className="!text-brand-700 hover:no-underline hover:text-brand-700"
            >
              {product.short_description?.html ? (
                <>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: product.short_description.html,
                    }}
                  />
                </>
              ) : (
                <span />
              )}
            </a>
          </div>

          {/* TO BE ADDED LATER */}
          <div className="product-ratings" />
          <div className="product-add-to-cart">
            <div className="pb-4 h-[38px] w-96">
              <AddToCartButton onClick={handleAddToCart} />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className="ds-sdk-product-item group relative flex flex-col w-full justify-between h-full"
      style={{
        'border-color': '#D5D5D5',
      }}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
    >
      <a
        href={productUrl as string}
        onClick={onProductClick}
        className="!text-brand-700 hover:no-underline hover:text-brand-700"
      >
        <div className="ds-sdk-product-item__main relative flex flex-col justify-between h-full">
          <div className="ds-sdk-product-item__image relative w-full h-full h-[445px] overflow-hidden">
            {productImageArray.length ? (
              <ImageHover
                images={
                  optimizedImageArray.length
                    ? optimizedImageArray
                    : productImageArray
                }
                // productName={product.name}
              />
            ) : (
              <NoImage
                className={`max-h-[45rem] w-full object-cover object-center lg:w-full`}
              />
            )}
            <div className="add-to-cart-overlay absolute left-0 right-0 bottom-0 p-xsmall h-[56px]">
              {shouldShowAddToBagButton && <AddToCartButton onClick={handleAddToCart} />}
              {showSizes && productView?.options?.map((swatches) => {
                if (swatches.title === SWATCH_SIZE) {
                  const swatchItems: SwatchValues[] = (swatches.values ?? []).map((swatch) => ({
                    ...swatch,
                    type: 'SIZE',
                  }));

                  return (
                    <SwatchButtonGroup
                      key={product?.sku}
                      isSelected={isSelected}
                      swatches={swatchItems}
                      showMore={onProductClick}
                      productUrl={productUrl as string}
                      onClick={handleSizeSelection}
                      sku={product?.sku}
                      maxSwatches={swatchItems.length}
                    />
                  );
                }
              })}
            </div>
          </div>
          <div className="flex flex-col px-xsmall py-small gap-2">
            {productView?.options && productView.options?.length > 0 && (
              <div className="ds-sdk-product-item__product-swatch flex flex-row text-sm text-brand-700">
                {productView?.options?.map(
                  (swatches) => {
                    if ([SWATCH_COLORS, SWATCH_COLORS_TEAM, SWATCH_COLORS_TEAM_NAME].includes(swatches.title || '')) {
                      return (
                        <SwatchButtonGroup
                          key={product?.sku}
                          isSelected={isSelected}
                          swatches={swatches.values ?? []}
                          showMore={onProductClick}
                          productUrl={productUrl as string}
                          onClick={handleSelection}
                          sku={product?.sku}
                        />
                      );
                    }
                  }
                )}
              </div>
            )}
            <div className="ds-sdk-product-item__product-name font-medium text-lg">
              {product.name !== null && htmlStringDecode(product.name)}
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
    </div>
  );
};

export default ProductItem;
