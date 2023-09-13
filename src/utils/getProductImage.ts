import { Product } from '../types/interface';

const getProductImageURL = (product: Product): string => {
  const item = product.productView;

  let url = null;

  if (item.images?.length) {
    url = item.images[0].url;
  } else if (item.images?.length) {
    url = item.images[0].url;
  } else if (item.images?.length) {
    url = item.images[0].url;
  }

  return url ?? '';
};

export { getProductImageURL };
