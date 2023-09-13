import { Product } from '../../types/interface';

type imageType = 'thumbnail' | 'small' | 'base';

const getProductImageURL = (product: Product, imageType: imageType): string => {
  const item = product.productView;

  let url = null;

  if (imageType === 'thumbnail' && item.images?.length) {
    //get thumbnail image
    url = item.images[0].url;
  } else if (
    (imageType === 'small' || imageType === 'thumbnail') &&
    item.images?.length
  ) {
    //default small && thumbnail to small image (if no thumbnail exists)
    url = item.images[0].url;
  } else if (item.images?.length) {
    //use base image if neither small or thumbnail exist
    url = item.images[0].url;
  }

  return url ?? '';
};

export { getProductImageURL };
