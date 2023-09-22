import { Product, Media } from '../../types/interface';

type imageType = 'thumbnail' | 'small' | 'base';

const getProductImageURL = (images: Media[], imageType: imageType): string => {
  let url = null;

  if (imageType === 'thumbnail' && images?.length) {
    //get thumbnail image
    const mainImages = images.filter((image) => image.url?.includes('main'));
    url = mainImages.length ? mainImages[0].url : images[0].url;
  } else if (
    (imageType === 'small' || imageType === 'thumbnail') &&
    images?.length
  ) {
    //default small && thumbnail to small image (if no thumbnail exists)
    const mainImages = images.filter((image) => image.url?.includes('main'));
    url = mainImages.length ? mainImages[0].url : images[0].url;
  } else if (images?.length) {
    //use base image if neither small or thumbnail exist
    const mainImages = images.filter((image) => image.url?.includes('main'));
    url = mainImages.length ? mainImages[0].url : images[0].url;
  }
  return url ?? '';
};

export { getProductImageURL };
