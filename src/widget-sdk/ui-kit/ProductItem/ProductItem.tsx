import { SwatchButton, SwatchButtonGroup } from '../../ui-kit';
import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { refineProductSearch } from '../../../api/search';
import { useStore } from '../../../context/store';

import NoImage from '../../icons/NoImage.svg';
import { Product, RefinedProduct } from '../../types/interface';
import {
  getProductImageURL,
  htmlStringDecode,
  SEARCH_UNIT_ID,
} from '../../utils';
import ProductPrice from './ProductPrice';
import { Media } from 'src/types/interface';

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
  const [selected, setSelected] = useState(false);
  const [selectedSwatch, setSelectedSwatch] = useState('');
  const [initialImages, setInitialImages] = useState<Media[] | null>();
  const [productImages, setImages] = useState<Media[] | null>();
  const [product, setProduct] = useState<RefinedProduct>();
  const storeCtx = useStore();
  const colorSwatches =
    item.productView.options?.filter((option) => option.id == 'color')[0]
      ?.values ?? [];
  const getInitialImages = async () => {
    const images = await refineProductSearch({
      ...storeCtx,
      optionIds: [colorSwatches[0].id],
      sku: item.productView.sku,
    });
    return images.refineProduct.images ?? productView.images;
  };

  if (!initialImages?.length) {
    getInitialImages().then((data) => {
      setInitialImages(data);
    });
  }

  const handleSelection = async (optionIds: string[], sku: string) => {
    const data = await refineProductSearch({
      ...storeCtx,
      optionIds: optionIds,
      sku: sku,
    });
    setSelectedSwatch(optionIds[0]);
    setImages(data.refineProduct.images);
    setProduct(data);
    setSelected(true);
  };

  const isSelected = (id: string) => {
    const selected = selectedSwatch ? selectedSwatch === id : false;
    return selected;
  };

  const productImage = getProductImageURL(
    productImages ? productImages ?? [] : initialImages ?? []
  ); // get image for PLP

  // will have to figure out discount logic for amount_off and percent_off still
  const discount: boolean = product
    ? product.refineProduct?.priceRange?.minimum?.regular?.amount?.value >
      product.refineProduct?.priceRange?.minimum?.final?.amount?.value
    : productView?.priceRange?.minimum?.regular?.amount?.value >
      productView?.priceRange?.minimum?.final?.amount?.value;
  const isBundle = productView?.__typename === 'BundleProduct';
  const isGrouped = productView?.__typename === 'GroupedProduct';
  const isGiftCard = productView?.__typename === 'GiftCardProduct';
  const isConfigurable = productView?.__typename === 'ConfigurableProduct';

  const onProductClick = () => {
    window.magentoStorefrontEvents?.publish.searchProductClick(
      SEARCH_UNIT_ID,
      productView?.sku
    );
  };

  const productUrl = storeCtx.route
    ? storeCtx.route({ sku: productView?.sku })
    : productView?.url;

  return (
    <div className="ds-sdk-product-item group relative flex flex-col justify-between h-full">
      <a
        href={productUrl as string}
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
              <NoImage className="max-h-[30rem] h-96 w-full object-cover object-center lg:h-96 lg:w-full" />
            )}
          </div>
          <div className="flex flex-col">
            <div className="ds-sdk-product-item__product-name mt-md text-sm text-primary">
              {htmlStringDecode(productView.name)}
            </div>
            <ProductPrice
              item={product ?? item}
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
        {productView?.options?.map(
          (swatches) =>
            swatches.id == 'color' && (
              <SwatchButtonGroup
                isSelected={isSelected}
                swatches={swatches.values ?? []}
                showMore={false}
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
