import { Product } from '../types/interface';

const getProductImageURL = (product: Product): string => {
  const item = product.product;

  let url = null;

  if (item.thumbnail) {
    url = item.thumbnail.url;
  } else if (item.small_image) {
    url = item.small_image.url;
  } else if (item.image) {
    url = item.image.url;
  }

  return url ?? '';
};

export { getProductImageURL };
