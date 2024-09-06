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
  ColorSwatchFromAttribute,
  Product,
  ProductViewMedia,
  RedirectRouteFunc,
  RefinedProduct,
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
import { Swatch, SwatchButtonGroup } from '../SwatchButtonGroup';
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

  const [imagesFromRefinedProduct, setImagesFromRefinedProduct] = useState<
    ProductViewMedia[] | null
  >();
  const [refinedProduct, setRefinedProduct] = useState<RefinedProduct>();
  const [isHovering, setIsHovering] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [quickAddStatus, setQuickAddStatus] = useState(QUICK_ADD_STATUS_IDLE);
  const { viewType } = useProducts();
  const { screenSize } = useSensor();
  const translation = useTranslation();

  const { colorSwatches, defaultColorSwatch} = useMemo(() => {
    const colorSwatchesFromAttribute = getColorSwatchesFromAttribute(productView, currentCategoryId);
    const colorSwatches: Swatch[] = colorSwatchesFromAttribute.map((swatch: ColorSwatchFromAttribute) => {
      const {
        id,
        image,
        label,
        config_sku: sku,
        config_id: configId,
      } = swatch;

      let imageUrl = generateOptimizedImages([image], 44, imageBackgroundColor || '', '1:1')[0]?.src;
      imageUrl = `${imageUrl}&dpr=${Math.round(window.devicePixelRatio)}`;

      return {
        id,
        title: label,
        sku,
        configId,
        type: 'IMAGE',
        value: imageUrl,
      };
    });

    const defaultColorOptionId = getDefaultColorSwatchId(item.productView, colorSwatchesFromAttribute)
    const defaultColorSwatch = defaultColorOptionId ? {
      sku: item.productView.sku,
      optionId: defaultColorOptionId,
    } : null

    return {
      colorSwatches,
      defaultColorSwatch
    }
  }, [item, currentCategoryId]);

  const [selectedColorSwatch, setSelectedColorSwatch] = useState<{
    sku: string,
    optionId: string,
  } | null>(defaultColorSwatch);

  const prevSelectedSwatch = useRef<{
    sku: string,
    optionId: string
  } | null>(defaultColorSwatch);

  const productSku = refinedProduct?.refineProduct?.sku || product?.sku;
  const productOptions = refinedProduct?.refineProduct?.options || productView?.options;
  const sizeOption = productOptions?.find((option) => option.title === SWATCH_SIZE);
  const sizeSwatches: Swatch[] = (sizeOption?.values ?? []).map((swatch) => ({
    ...swatch,
    type: 'SIZE',
    sku: productSku,
  }));

  useEffect(() => {
    let isSwatchUpdated = false;
    async function fetchData() {
      try {
          if (!selectedColorSwatch) {
            return;
          }
          
          const { sku, optionId} = selectedColorSwatch;
          const data = await refineProduct([optionId], sku);
          // Return early if different swatch is selected before request is complete
          if (isSwatchUpdated) {
            return;
          }

          setImagesFromRefinedProduct(data.refineProduct.images);
          setRefinedProduct(data);

          prevSelectedSwatch.current = selectedColorSwatch;
        } catch (error) {
          // Reset the selected swatch if there is an error
          if (!isSwatchUpdated && prevSelectedSwatch.current && prevSelectedSwatch.current !== selectedColorSwatch) {
            setSelectedColorSwatch(prevSelectedSwatch.current);
          }

          // eslint-disable-next-line no-console
          console.error('Error fetching refined product', error);
        }
    }
    fetchData();

    return () => {
      isSwatchUpdated = true;
    }
  }, [selectedColorSwatch]);

  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
    setShowSizes(false);
    setQuickAddStatus(QUICK_ADD_STATUS_IDLE);
  };

  const handleColorSelection = async (optionIds: string[], sku: string) => {
    if (selectedColorSwatch?.optionId !== optionIds[0] && selectedColorSwatch?.sku !== sku) {
      setSelectedColorSwatch({
        sku,
        optionId: optionIds[0],
      });
    }
  };

  const isSelected = (id: string) => {
    const selected = selectedColorSwatch ? selectedColorSwatch.optionId === id : false;
    return selected;
  };

  const productImageArray = imagesFromRefinedProduct
    ? getProductImageURLs(imagesFromRefinedProduct ?? [], 2)
    : getProductImagesFromAttribute(productView, currentCategoryId);

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
  const shouldShowAddToBagButton = isSportsWear(productView)
    && categoryConfig?.['plp_quick_view_modal_enabled'] === '1'
    && !disableAllPurchases
    && (!screenSize.desktop || isHovering)
    && sizeSwatches.length > 0
    && !showSizes
    && quickAddStatus === QUICK_ADD_STATUS_IDLE;

  const onProductClick = () => {
    window.adobeDataLayer.push((dl: any) => {
      dl.push({
        event: 'search-product-click',
        eventInfo: {
          ...dl.getState(),
          sku: productSku,
          searchUnitId: SEARCH_UNIT_ID,
        },
      });
    });
  };

  const productUrl = setRoute
    ? setRoute({
        sku: productSku,
        urlKey: refinedProduct?.refineProduct?.urlKey || productView?.urlKey,
        optionsUIDs: selectedColorSwatch ? [selectedColorSwatch.optionId] : null,
      })
    : refinedProduct?.refineProduct?.url || product?.canonical_url;

  const handleAddToCart = async (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();

    const hasSizeOptions = productView?.options?.some((swatches) => swatches.title === SWATCH_SIZE);
    if ((!listview || viewType !== 'listview') && hasSizeOptions) {
      setShowSizes(true);
      return;
    }

    const selectedVariants = selectedColorSwatch ? [selectedColorSwatch.optionId] : [];
    await addToCart(productSku, selectedVariants, 1, 'product-list-page');
  };

  const handleSizeSelection = async (optionIds: string[]) => {
    const selectedSize = sizeSwatches?.find((size) => optionIds.includes(size.id));
    if (!selectedSize || !selectedSize.inStock) {
      return;
    }

    const selectedVariants: string[] = selectedColorSwatch ? [selectedColorSwatch.optionId, ...optionIds] : [...optionIds];
    setShowSizes(false);
    setQuickAddStatus(QUICK_ADD_STATUS_PENDING);
    const addedToCart = await addToCart(selectedSize.sku, selectedVariants, 1, 'product-list-page');

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
                  {productSku !== null && htmlStringDecode(productSku)}
                </div>
              </a>

              {/* Swatch */}
              <div className="ds-sdk-product-item__product-swatch flex flex-row mt-sm text-sm text-brand-700 pb-6">
                {sizeSwatches.length > 0 && (
                  <SwatchButtonGroup
                    isSelected={() => false}
                    swatches={sizeSwatches}
                    showMore={onProductClick}
                    productUrl={productUrl as string}
                    onClick={handleSizeSelection}
                  />
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

  const productAvailability = (refinedProduct?.refineProduct ? refinedProduct?.refineProduct.inStock : productView?.inStock) 
    ? 'InStock' 
    : 'OutOfStock';
  return (
    <div itemScope itemType="http://schema.org/Product"
      className="ds-sdk-product-item group relative flex flex-col w-full justify-between h-full"
      style={{
        'border-color': '#D5D5D5',
      }}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
    >
      <meta itemProp="sku" content={productSku} />
      <meta itemProp="description" content={product?.short_description?.html} />
      <meta itemProp="availability" content={productAvailability}/>
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
              {showSizes && sizeSwatches.length > 0 && (
                <SwatchButtonGroup
                  isSelected={() => false}
                  swatches={sizeSwatches}
                  showMore={onProductClick}
                  productUrl={productUrl as string}
                  onClick={handleSizeSelection}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col px-xsmall py-small gap-2">
            {colorSwatches && colorSwatches.length > 0 && (
              <div className="ds-sdk-product-item__product-swatch flex flex-row text-sm text-brand-700">
                 <SwatchButtonGroup
                    isSelected={isSelected}
                    swatches={colorSwatches}
                    showMore={onProductClick}
                    productUrl={productUrl as string}
                    onClick={handleColorSelection}
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
