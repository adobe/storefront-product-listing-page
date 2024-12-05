/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import { ProductView, ProductViewMedia } from '../types/interface';
import { 
  getColorOptionsFromProductOptions,
  getImageConfigsFromAttribute,
  getSegmentedOptions,
  isSportsWear} from './productUtils';

const isValidImageUrl = (url: string | undefined) => url && !url.includes('product/no_selection');

const getProductImageURLs = (
  images: ProductViewMedia[],
  amount: number = 3,
  topImageUrl?: string
): string[] => {
  const imageUrlArray: Array<string> = [];
  const url = new URL(window.location.href);
  const protocol = url.protocol;

  // const topImageUrl = "http://master-7rqtwti-wdxwuaerh4gbm.eu-4.magentosite.cloud/media/catalog/product/3/1/31t0a-sopll._ac_.jpg";
  for (const image of images) {
    const imageUrl = image.url?.replace(/^https?:\/\//, '');
    if (isValidImageUrl(imageUrl)) {
      if (image.roles?.includes('image')) {
        topImageUrl = imageUrl;
      } else {
        imageUrlArray.push(`${protocol}//${imageUrl}`);
      }
    }
  }

  if (topImageUrl) {
    const topImageUrlFormatted = `${protocol}//${topImageUrl.replace(
      /^https?:\/\//,
      ''
    )}`;
    const index = topImageUrlFormatted.indexOf(topImageUrlFormatted);
    if (index > -1) {
      imageUrlArray.splice(index, 1);
    }

    imageUrlArray.unshift(topImageUrlFormatted);
  }

  return imageUrlArray.slice(0, amount);
};

export interface ResolveImageUrlOptions {
  width: number;
  height?: number;
  auto?: string;
  quality?: number;
  crop?: boolean;
  fit?: string;
}

const resolveImageUrl = (url: string, opts: ResolveImageUrlOptions): string => {
  if (!isValidImageUrl(url)) {
    return '';
  }

  const [base, query] = url.split('?');
  const params = new URLSearchParams(query);

  Object.entries(opts).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  return `${base}?${params.toString()}`;
};

const generateOptimizedImages = (
  imageUrls: string[],
  baseImageWidth: number,
  imageBackgroundColor: string,
  aspectRatio?: string | undefined
): { src: string; srcset: any }[] => {
  const baseOptions = {
    fit: 'bounds',
    orient: 1,
    quality: 95,
    optimize: 'high',
    format: 'pjpeg',
    auto: 'webp',
    enable: 'upscale',
    canvas: aspectRatio || '9:11',
    'bg-color': imageBackgroundColor,
  };

  const imageUrlArray: Array<{ src: string; srcset: any }> = [];

  for (const imageUrl of imageUrls) {
    const src = resolveImageUrl(imageUrl, {
      ...baseOptions,
      width: baseImageWidth,
    });
    const dpiSet = [1, 2, 3];
    const srcset = dpiSet.map((dpi) => {
      return `${resolveImageUrl(imageUrl, {
        ...baseOptions,
        auto: 'webp',
        quality: 80,
        width: baseImageWidth * dpi,
      })} ${dpi}x`;
    });
    imageUrlArray.push({ src, srcset });
  }

  return imageUrlArray;
};

/*
* New attribute i.e. "eds_images" for product images were introduced to get around catalog service sync issue
* Ref: https://adobe-dx-support.slack.com/archives/C04CQH83BME/p1719261375238899
*
* Following steps are taken to get the images:
* 1. Get the attribute id from the product options by selecting the first option
* 2. Find the attribute with name "eds_images"
* 3. Parse the value of the attribute
* 4. Find the option with the same attribute id as found in step 1
* 6. If the product is sports wear, get the images from the option with same the variant id as in product view options found in step 1.
* 7. If the product is not sports wear, get the images from the first option.
*/
function getProductImagesFromAttribute(productView: ProductView, categoryId?: string) {
  const colorOptionsFromProductOptions = getColorOptionsFromProductOptions(productView);
  const imageConfigs = getImageConfigsFromAttribute(productView);

  const colorOptionsFromAttribute = imageConfigs.find((config: any) => config.attribute_id === colorOptionsFromProductOptions?.id);
  const firstColorOptionsFromProductOptions = colorOptionsFromProductOptions?.values?.[0];

  if (isSportsWear(productView) && firstColorOptionsFromProductOptions) {
    const colorVariantId = firstColorOptionsFromProductOptions.id;
    const defaultColorOption = colorOptionsFromAttribute.images.find((colorOption: any) => colorOption.id === colorVariantId)
      || colorOptionsFromAttribute.images[0];
  
    return getAbsoluteImageUrl(productView, [defaultColorOption.image, defaultColorOption.back_view_image]);
  }
    
  if (colorOptionsFromAttribute && colorOptionsFromAttribute.images.length > 0) {
    const segmentedOptions = categoryId ? getSegmentedOptions(productView, colorOptionsFromProductOptions?.id || null, categoryId) : null;
    const defaultColorOption = colorOptionsFromAttribute.images.find((option: any) => !segmentedOptions || segmentedOptions.includes(option.id));
    return getAbsoluteImageUrl(productView, [defaultColorOption.image, defaultColorOption.back_view_image]);
  }

  return [];
}

function getAbsoluteImageUrl(productView: ProductView, urls: string[]) {
  return urls.map((url) => {
    if (!isValidImageUrl(url)) {
      return '';
    }

    if (url.startsWith('http')) {
      return url;
    }

    if (url.startsWith('/')) {
      url = url.slice(1);
    }

    const baseUrl = productView?.url?.replace(productView?.urlKey || '', '');
    return baseUrl + url;
  });
}

export { generateOptimizedImages, getProductImageURLs, getProductImagesFromAttribute };
