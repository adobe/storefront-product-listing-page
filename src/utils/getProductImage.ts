/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { AssetSourceAem, Product, ProductViewMedia } from '../types/interface';

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
      imageUrlArray.push(`${protocol}//${imageUrl}`);
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
  baseImageWidth: number
): { src: string; srcset: any }[] => {
  const baseOptions = {
    fit: 'cover',
    crop: false,
    dpi: 1,
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

const resolveAEMImageUrl = (url: string, seoNameString: string, options: AssetSourceAem): string => {
  const { type: _, seoName, format, ...urlParams } = options
  const [base] = url.split('?');
  const params = {
    ...urlParams,
    crop: urlParams.crop?.join(','),
    size: urlParams.size?.join(','),
  }

  const stringEntries = Object.entries(params).map(([key, val]) => [`${key}`, `${val}`]);
  const queryParams = new URLSearchParams(stringEntries)
  return `${base}/as/${seoNameString}.${format}?${queryParams.toString()}`;
};

const generateOptimizedAEMImages = (
    imageUrls: string[],
    product: Product['product'],
    options: AssetSourceAem
): { src: string; srcset: any }[] => {
  const { type: _, seoName, format, ...urlParams } = options
  const seoNameString = seoName(product);

  const imageUrlArray: Array<{ src: string, srcset: string[] }> = [];

  for (const imageUrl of imageUrls) {
    const src = resolveAEMImageUrl(imageUrl, seoNameString, {
      ...options,
      width: options.width ?? 200
    })
    const dpiSet = [1, 2, 3];
    const srcset = dpiSet.map((dpi) => {
      return `${resolveAEMImageUrl(imageUrl, seoNameString, {
        ...options,
        quality: options.quality ?? 80,
        width: (options.width ?? 200) * dpi,
      })} ${dpi}x`;
    });
    imageUrlArray.push({ src, srcset });
  }

  return imageUrlArray
};

export { generateOptimizedImages, generateOptimizedAEMImages, getProductImageURLs };
