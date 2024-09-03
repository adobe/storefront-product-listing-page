/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useEffect,useMemo,useRef, useState } from 'preact/hooks';

import '../ProductItem/ProductItem.css';

import { useProducts, useSensor, useStore, useTranslation } from '../../context';
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
import { getColorSwatchesFromAttribute, getDefaultColorSwatchId, isSportsWear } from '../../utils/productUtils';
import { AddToCartButton } from '../AddToCartButton';
import ImageHover from '../ImageHover';
import { SwatchButtonGroup } from '../SwatchButtonGroup';
import ProductPrice from './ProductPrice';

export interface ProductProps {
  item: Product;
  currencySymbol: string;
  currencyRate?: string;
  categoryConfig?: Record<string, any>;
  setRoute?: RedirectRouteFunc | undefined;
  refineProduct: (optionIds: string[], sku: string) => any;
  setCartUpdated: (cartUpdated: boolean) => void;
  setItemAdded: (itemAdded: string) => void;
  setError: (error: boolean) => void;
  addToCart: (
    sku: string,
    options: string[],
    quantity: number,
    source: string,
  ) => Promise<{
    user_errors: any[];
  }>;
  disableAllPurchases: boolean;
}

const SWATCH_COLORS = 'Colors';
const SWATCH_SIZE = 'Size';

const QUICK_ADD_STATUS_IDLE = 'IDLE';
const QUICK_ADD_STATUS_PENDING = 'PENDING';
const QUICK_ADD_STATUS_SUCCESS = 'SUCCESS';
const QUICK_ADD_STATUS_ERROR = 'ERROR';

export const ProductItem: FunctionComponent<ProductProps> = ({
  item,
  currencySymbol,
  currencyRate,
  categoryConfig,
  setRoute,
  refineProduct,
  addToCart,
  disableAllPurchases,
}: ProductProps) => {
  const { product, productView } = item;
  const {
    config: { optimizeImages, imageBaseWidth, listview, imageBackgroundColor, currentCategoryId },
  } = useStore();

  const defaultColorSwatchId = getDefaultColorSwatchId(item, currentCategoryId);
  const [selectedSwatch, setSelectedSwatch] = useState(defaultColorSwatchId);
  const [imagesFromRefinedProduct, setImagesFromRefinedProduct] = useState<
    ProductViewMedia[] | null
  >();
  const [refinedProduct, setRefinedProduct] = useState<RefinedProduct>();
  const [isHovering, setIsHovering] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [quickAddStatus, setQuickAddStatus] = useState(QUICK_ADD_STATUS_IDLE);
  const prevSelectedSwatch = useRef<string | null>(null);
  const { viewType } = useProducts();

  const { screenSize } = useSensor();
  const translation = useTranslation();

  useEffect(() => {
    prevSelectedSwatch.current = selectedSwatch;
  }, [selectedSwatch]);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
    setShowSizes(false);
    setQuickAddStatus(QUICK_ADD_STATUS_IDLE);
  };

  const handleSelection = async (optionIds: string[], sku: string) => {
    const selectedSwatchBeforeUdpate = selectedSwatch;
    const nextSelectedSwatch = optionIds[0];
    setSelectedSwatch(nextSelectedSwatch);

    try {
      const data = await refineProduct(optionIds, sku);
      // If different swatch is selected before the data is fetched, do not update the state
      if (prevSelectedSwatch.current !== nextSelectedSwatch) {
        return;
      }

      setImagesFromRefinedProduct(data.refineProduct.images);
      setRefinedProduct(data);
    } catch (error) {
      // Reset the selected swatch if there is an error
      if (prevSelectedSwatch.current === nextSelectedSwatch) {
        setSelectedSwatch(selectedSwatchBeforeUdpate);
      }

      // eslint-disable-next-line no-console
      console.error('Error fetching refined product', error);
    }
  };

  const isSelected = (id: string) => {
    const selected = selectedSwatch ? selectedSwatch === id : false;
    return selected;
  };


  const productImageArray = imagesFromRefinedProduct
    ? getProductImageURLs(imagesFromRefinedProduct ?? [], 2)
    : getProductImagesFromAttribute(item, currentCategoryId);

  let optimizedImageArray: { src: string; srcset: any }[] = [];

  if (optimizeImages) {
    optimizedImageArray = generateOptimizedImages(
      productImageArray,
      imageBaseWidth ?? 200,
      imageBackgroundColor || ''
    );
  }

  // Rating data
  const ratingValue = parseFloat(productView?.attributes?.filter((attr) => attr?.name === 'bv_rating_average')[0]?.value) || 0;
  const ratingCount = parseInt(productView?.attributes?.filter((attr) => attr?.name === 'bv_rating_count')[0]?.value, 10) || 0;

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
  const shouldShowAddToBagButton = isSportsWear(item)
    && categoryConfig?.['plp_quick_view_modal_enabled'] === '1'
    && !disableAllPurchases
    && (!screenSize.desktop || isHovering)
    && !showSizes
    && quickAddStatus === QUICK_ADD_STATUS_IDLE;

  const colorSwatchesFromAttribute = useMemo(() => getColorSwatchesFromAttribute(item, currentCategoryId), [item]);
  let colorSwatches: SwatchValues[] = [];
  if (colorSwatchesFromAttribute && colorSwatchesFromAttribute.length > 0) {
    colorSwatches = colorSwatchesFromAttribute.map((swatch: any) => {
      let imageUrl = generateOptimizedImages([swatch.image], 44, imageBackgroundColor || '', '1:1')[0]?.src;
      imageUrl = `${imageUrl}&dpr=${Math.round(window.devicePixelRatio)}`;

      return {
        id: swatch.id,
        type: 'IMAGE',
        value: imageUrl,
        title: swatch.title,
      };
    });
  }

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
    ? setRoute({
        sku: productView?.sku,
        urlKey: productView?.urlKey,
        optionsUIDs: selectedSwatch ? [selectedSwatch] : null,
      })
    : product?.canonical_url;

  const handleAddToCart = async (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();

    const hasSizeOptions = productView?.options?.some((swatches) => swatches.title === SWATCH_SIZE);
    if ((!listview || viewType !== 'listview') && hasSizeOptions) {
      setShowSizes(true);
      return;
    }

    const selectedVariants = selectedSwatch ? [selectedSwatch] : [];
    await addToCart(productView.sku, selectedVariants, 1, 'product-list-page');
  };

  const handleSizeSelection = async (optionIds: string[]) => {
    const sizeVariants = item.productView?.options?.find((option) => option.title === SWATCH_SIZE)?.values;
    const selectedSize = sizeVariants?.find((size) => optionIds.includes(size.id));
    if (selectedSize && !selectedSize.inStock) {
      return;
    }

    let selectedVariants: string[] = [];
    // Sportswear products do not have multiple color swatches
    // Select the default color variant
    const colorVariant = item.productView?.options?.find((option) => option.title === SWATCH_COLORS)?.values?.[0].id;
    if (colorVariant) {
      selectedVariants = [colorVariant];
    }

    if (optionIds) {
      selectedVariants = [...selectedVariants, ...optionIds];
    }

    setShowSizes(false);
    setQuickAddStatus(QUICK_ADD_STATUS_PENDING);
    const addedToCart = await addToCart(productView.sku, selectedVariants, 1, 'product-list-page');

    if (addedToCart?.user_errors?.length) {
      setQuickAddStatus(QUICK_ADD_STATUS_ERROR);
    } else {
      setQuickAddStatus(QUICK_ADD_STATUS_SUCCESS);
    }
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
              className="!text-brand-700 hover:no-underline"
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
                className="!text-brand-700 hover:no-underline"
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
              className="!text-brand-700 hover:no-underline"
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
              className="!text-brand-700 hover:no-underline"
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
    <div itemScope itemType="http://schema.org/Product"
      className="ds-sdk-product-item group relative flex flex-col w-full justify-between h-full"
      style={{
        'border-color': '#D5D5D5',
      }}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
    >
      <meta itemProp="sku" content={product?.sku} />
      <meta itemProp="description" content={product?.short_description?.html} />
      <meta itemProp="availability" content={productView?.inStock ? 'InStock' : 'OutOfStock'} />
      {ratingCount > 0 ? (
        <div itemprop="aggregateRating" style="display:none"
             itemscope itemtype="https://schema.org/AggregateRating">
          <meta itemprop="ratingValue" content={ratingValue.toFixed(2).toString()}/>
          <meta itemprop="ratingCount" content={ratingCount.toString()}/>
        </div>
      ) : ''}
      <a itemProp="url"
        href={productUrl as string}
        onClick={onProductClick}
        className="!text-brand-700 hover:no-underline"
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
              {quickAddStatus !== QUICK_ADD_STATUS_IDLE && (
                <div className="status-container flex items-center justify-center h-full w-full">
                  {quickAddStatus === QUICK_ADD_STATUS_PENDING && (
                    <span className="loader" />
                  )}
                  {quickAddStatus === QUICK_ADD_STATUS_SUCCESS && (
                    <span className="status status-success">{translation.ProductCard.quickAddSuccess}</span>
                  )}
                  {quickAddStatus === QUICK_ADD_STATUS_ERROR && (
                    <span className="status status-error">{translation.ProductCard.quickAddError}</span>
                  )}
                </div>
              )}
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
                    />
                  );
                }
              })}
            </div>
          </div>
          <div className="flex flex-col px-xsmall py-small gap-2">
            {colorSwatches && colorSwatches.length > 0 && (
              <div className="ds-sdk-product-item__product-swatch flex flex-row text-sm text-brand-700">
                 <SwatchButtonGroup
                    key={product?.sku}
                    isSelected={isSelected}
                    swatches={colorSwatches}
                    showMore={onProductClick}
                    productUrl={productUrl as string}
                    onClick={handleSelection}
                    sku={product?.sku}
                  />
              </div>
            )}
            <div itemProp="name" className="ds-sdk-product-item__product-name font-medium text-lg">
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
              inStock={productView?.inStock}
            />
          </div>
        </div>
      </a>
    </div>
  );
};

export default ProductItem;
