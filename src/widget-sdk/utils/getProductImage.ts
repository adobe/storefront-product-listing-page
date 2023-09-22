import { Product, Media } from '../../types/interface';

type imageType = 'thumbnail' | 'small' | 'base';

const getProductImageURL = (images: Media[]): string => {
  let url = null;

  if (images?.length) {
    const mainImages = images.filter((image) => image.url?.includes('main'));
    url = mainImages.length ? mainImages[0].url : images[0].url;
  }
  return url ?? '';
};

export { getProductImageURL };
