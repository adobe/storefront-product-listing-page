import { Product } from '../types/interface';

const getProductImageURL = (product: Product): string => {
  const item = product.productView;

  let url = null;

  if (item.images?.length) {
    const mainImages = item.images.filter((image) =>
      image.url?.includes('main')
    );
    url = mainImages.length ? mainImages[0].url : item.images[0].url;
  }

  return url ?? '';
};

export { getProductImageURL };
