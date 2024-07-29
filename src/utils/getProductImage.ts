/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { Product, ProductViewMedia } from '../types/interface';
import { isSportsWear } from './productUtils';

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
    if (imageUrl) {
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
): { src: string; srcset: any }[] => {
  const baseOptions = {
    fit: 'bounds',
    dpi: 1,
    orient: 1,
    quality: 95,
    optimize: 'high',
    format: 'pjpeg',
    auto: 'webp',
    enable: 'upscale',
    canvas: '9:11',
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
function getProductImagesFromAttribute(item: Product) {
  const { productView } = item;
  const attributeId = productView?.options?.[0].id;
  if (!attributeId) {
    return [];
  }

  const imageAttributes = productView?.attributes?.find(({ name }) => name === 'eds_images');
  if (imageAttributes) {
    const options = JSON.parse(imageAttributes.value);
    const defaultOption = options.find((option: any) => option.attribute_id === attributeId);
    if (!defaultOption) {
      return [];
    }

    const variantId = productView?.options?.[0].values?.[0].id;
    if (isSportsWear(item) && defaultOption.images) {
      const imageConfig = defaultOption.images.find((image: any) => image.id === variantId);
      return getAbsoluteImageUrl(item, [imageConfig.image, imageConfig.back_view_image]);
    }

    if (defaultOption && defaultOption.images.length > 0) {
      const imageConfig = defaultOption.images[0];
      return getAbsoluteImageUrl(item, [imageConfig.image, imageConfig.back_view_image]);
    } 
  }

  return [];
}

function getAbsoluteImageUrl(item: Product, urls: string[]) {
  return urls.map((url) => {
    if (url.startsWith('http')) {
      return url;
    }

    if (url.startsWith('/')) {
      url = url.slice(1);
    }

    const { productView } = item;
    const baseUrl = productView?.url?.replace(productView?.urlKey || '', '');
    return baseUrl + url;
  });
}

export { generateOptimizedImages, getProductImageURLs, getProductImagesFromAttribute };
