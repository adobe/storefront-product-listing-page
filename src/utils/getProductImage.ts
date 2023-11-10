/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { ProductViewMedia } from '../types/interface';

type ImageTypes = {
  thumbnail?: string[] | null;
  small_image?: string[] | null;
  image?: string[] | null;
  main?: string[] | null;
  other?: string[] | null;
};

const getProductImageURL = (images: ProductViewMedia[]): string[] => {
  const imageTypes: ImageTypes = {
    thumbnail: [],
    small_image: [],
    image: [],
    main: [],
    other: [],
  };
  const url = new URL(window.location.href);
  const protocol = url.protocol;

  if (images?.length) {
    for (const image of images) {
      if (image.roles?.includes('thumbnail')) {
        imageTypes.thumbnail?.push(
          image.url?.replace(/^https?:\/\//, '') ?? ''
        );
      } else if (image.roles?.includes('small_image')) {
        imageTypes.small_image?.push(
          image.url?.replace(/^https?:\/\//, '') ?? ''
        );
      } else if (image.roles?.includes('image')) {
        imageTypes.image?.push(image.url?.replace(/^https?:\/\//, '') ?? '');
      } else if (image.url?.includes('main')) {
        imageTypes.main?.push(image.url?.replace(/^https?:\/\//, '') ?? '');
      } else {
        imageTypes.other?.push(image.url?.replace(/^https?:\/\//, '') ?? '');
      }
    }
  }

  const imageTypesArray =
    imageTypes.thumbnail?.concat(
      imageTypes.small_image ?? [],
      imageTypes.image ?? [],
      imageTypes.main ?? [],
      imageTypes.other ?? []
    ) ?? [];

  const imageUrlArray: Array<string> = [];

  if (imageTypesArray.length) {
    for (const imageUrl of imageTypesArray) {
      imageUrl
        ? imageUrlArray.push(`${protocol}//${imageUrl}`)
        : imageUrlArray.push('');
    }
  }

  return imageUrlArray
    .filter((url, index) => imageUrlArray.indexOf(url) === index)
    .slice(0, 3);
};

export { getProductImageURL };
