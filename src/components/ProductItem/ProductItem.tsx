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
} from '../../types/interface';
import { SEARCH_UNIT_ID } from '../../utils/constants';
import {
  generateOptimizedImages,
  getProductImageURLs,
} from '../../utils/getProductImage';
import { htmlStringDecode } from '../../utils/htmlStringDecode';
import { AddToCartButton } from '../AddToCartButton';
import { ImageCarousel } from '../ImageCarousel';
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
    options: [],
    quantity: number
  ) => Promise<void | undefined>;
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
  addToCart,
}: ProductProps) => {
  const { product, productView } = item;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedSwatch, setSelectedSwatch] = useState('');
  const [imagesFromRefinedProduct, setImagesFromRefinedProduct] = useState<
    ProductViewMedia[] | null
  >();
  const [refinedProduct, setRefinedProduct] = useState<RefinedProduct>();
  const [isHovering, setIsHovering] = useState(false);
  const { addToCartGraphQL, refreshCart } = useCart();
  const { viewType } = useProducts();
  const {
    config: { optimizeImages, imageBaseWidth, imageCarousel, listview },
  } = useStore();

  const { screenSize } = useSensor();

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
    ? getProductImageURLs(imagesFromRefinedProduct ?? [], imageCarousel ? 3 : 1)
    : getProductImageURLs(
        productView.images ?? [],
        imageCarousel ? 3 : 1, // number of images to display in carousel
        product.image?.url ?? undefined
      );
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

  const getLabels = () => {
    try {
      const attributes = productView?.attributes || [];

      let labels = attributes.find((attribute) => attribute.name === "labels");    

      return labels ? JSON.parse(labels.value) : [];
    } catch (e){
      console.log("e", e);      
      return [];
    }
    

  };

  const labelsHtml = () => {
    const labels = getLabels();   
    
    return labels.map((label:any) => {
      let cssPosition = "position:absolute; z-index:1;";      
      
      switch(label.position){
        case 'top-left':
          cssPosition += "top:0px; left: 0px;";
          break;
        case 'top-center':
          cssPosition += "top: 0px; left: 50%; tranform: translate(-50%,-50%)";
          break;
        case 'top-right':
          cssPosition += "top:0px; right: 0px;";
          break;
        case 'bottom-left':
          cssPosition += "bottom:0px; left: 0px;";
          break;
        case 'bottom-center':
          cssPosition += "bottom: 0px; left: 50%; tranform: translate(-50%,-50%)";
          break;
        case 'bottom-right':
          cssPosition += "bottom:0px; right: 0px;";
          break;
        default:
          cssPosition += "";
      }

      const content = label.image ? <img src={"/" + label.image} alt={label.alt_tag} /> : label.txt;

      return <div style={cssPosition}><div style={label.style}>{content}</div></div>
    });
  }

  
  

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
    ? setRoute({ sku: productView?.sku, urlKey: productView?.urlKey })
    : product?.canonical_url;

  const handleAddToCart = async () => {
    setError(false);
    if (isSimple) {
      if (addToCart) {
        //Custom add to cart function passed in
        await addToCart(productView.sku, [], 1);
      } else {
        // Add to cart using GraphQL & Luma extension
        const response = await addToCartGraphQL(productView.sku);

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
    } else if (productUrl) {
      window.open(productUrl, '_self');
    }
  };

  if (listview && viewType === 'listview') {
    return (
      <>
        <div className="grid-container">
          <div
            className={`product-image ds-sdk-product-item__image relative rounded-md overflow-hidden}`}
          >
            <a
              href={productUrl as string}
              onClick={onProductClick}
              className="!text-primary hover:no-underline hover:text-primary"
            >
              {/* Image */}
              {productImageArray.length ? (
                <ImageCarousel
                  images={
                    optimizedImageArray.length
                      ? optimizedImageArray
                      : productImageArray
                  }
                  productName={product.name}
                  carouselIndex={carouselIndex}
                  setCarouselIndex={setCarouselIndex}
                />
              ) : (
                <NoImage
                  className={`max-h-[250px] max-w-[200px] pr-5 m-auto object-cover object-center lg:w-full`}
                />
              )}
            </a>
          </div>
          <div className="product-details">
            <div className="flex flex-col w-1/3">
              {/* Product name */}
              <a
                href={productUrl as string}
                onClick={onProductClick}
                className="!text-primary hover:no-underline hover:text-primary"
              >
                <div className="ds-sdk-product-item__product-name mt-xs text-sm text-primary">
                  {product.name !== null && htmlStringDecode(product.name)}
                </div>
                <div className="ds-sdk-product-item__product-sku mt-xs text-sm text-primary">
                  SKU:
                  {product.sku !== null && htmlStringDecode(product.sku)}
                </div>
              </a>              
            </div>
          </div>
          <div className="product-price">
            <a
              href={productUrl as string}
              onClick={onProductClick}
              className="!text-primary hover:no-underline hover:text-primary"
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
          <div className="product-description text-sm text-primary mt-xs">
            <a
              href={productUrl as string}
              onClick={onProductClick}
              className="!text-primary hover:no-underline hover:text-primary"
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
        </div>
      </>
    );
  }

  return (
    <div
      className="ds-sdk-product-item group relative flex flex-col max-w-sm justify-between h-full border-solid border-offset-2"
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
            {labelsHtml()}
            {productImageArray.length ? (              
              <ImageCarousel
                images={
                  optimizedImageArray.length
                    ? optimizedImageArray
                    : productImageArray
                }
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

            {/* 
            //TODO: Wishlist button to be added later
            {flags.addToWishlist && widgetConfig.addToWishlist.enabled && (
              // TODO: Remove flag during phase 3 MSRCH-4278
              <div className="ds-sdk-wishlist ml-auto mt-md">
                <WishlistButton
                  productSku={item.product.sku}
                  type={widgetConfig.addToWishlist.placement}
                />
              </div>
            )} */}
          </div>
        </div>
      </a>
    </div>
  );
};

export default ProductItem;
