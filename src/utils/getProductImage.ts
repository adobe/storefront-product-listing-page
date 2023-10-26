/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { ProductViewMedia } from '../types/interface';

type ImageTypes = {
  thumbnail?: string | null;
  small_image?: string | null;
  image?: string | null;
  main?: string | null;
};

const getProductImageURL = (images: ProductViewMedia[]): string => {
  const imageTypes: ImageTypes = {};
  const url = new URL(window.location.href);
  const protocol = url.protocol;

  if (images?.length) {
    for (const image of images) {
      if (image.roles.includes('thumbnail')) {
        imageTypes.thumbnail = image.url?.replace(/^https?:\/\//, '');
      } else if (image.roles.includes('small_image')) {
        imageTypes.small_image = image.url?.replace(/^https?:\/\//, '');
      } else if (image.roles.includes('image')) {
        imageTypes.image = image.url?.replace(/^https?:\/\//, '');
      } else if (image.url?.includes('main')) {
        imageTypes.main = image.url?.replace(/^https?:\/\//, '');
      }
    }
  }

  const imageUrl =
    imageTypes.thumbnail ??
    imageTypes.small_image ??
    imageTypes.image ??
    imageTypes.main ??
    '';

  return imageUrl ? `${protocol}//${imageUrl}` : '';
};

export { getProductImageURL };
