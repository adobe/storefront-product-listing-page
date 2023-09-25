import { Product } from '../../types/interface';

type imageType = 'thumbnail' | 'small' | 'base';

const getProductImageURL = (product: Product, imageType: imageType): string => {
  const item = product.product;

  let url = null;

  if (imageType === 'thumbnail' && item.thumbnail) {
    //get thumbnail image
    url = item.thumbnail.url;
  } else if (
    (imageType === 'small' || imageType === 'thumbnail') &&
    item.small_image
  ) {
    //default small && thumbnail to small image (if no thumbnail exists)
    url = item.small_image.url;
  } else if (item.image) {
    //use base image if neither small or thumbnail exist
    url = item.image.url;
  }

  return url ?? '';
};

export { getProductImageURL };
