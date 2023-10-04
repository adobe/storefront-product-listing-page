import { Media } from '../../types/interface';

const getProductImageURL = (images: Media[]): string => {
  let url = null;

  if (images?.length) {
    const mainImages = images.filter((image) => image.url?.includes('main'));
    url = mainImages.length ? mainImages[0].url : images[0].url;
  }
  return url ?? '';
};

export { getProductImageURL };
