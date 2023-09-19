import { Product, Media } from '../../types/interface';

type imageType = 'thumbnail' | 'small' | 'base';

const getProductImageURL = (images: Media[], imageType: imageType): string => {
  let url = null;

  if (imageType === 'thumbnail' && images?.length) {
    //get thumbnail image
    url = images[0].url;
  } else if (
    (imageType === 'small' || imageType === 'thumbnail') &&
    images?.length
  ) {
    //default small && thumbnail to small image (if no thumbnail exists)
    url = images[0].url;
  } else if (images?.length) {
    //use base image if neither small or thumbnail exist
    url = images[0].url;
  }

  return url ?? '';
};

export { getProductImageURL };
