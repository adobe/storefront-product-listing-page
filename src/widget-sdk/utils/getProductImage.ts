import { Media } from '../../types/interface';

type ImageTypes = {
  thumbnail?: string | null;
  small_image?: string | null;
  image?: string | null;
  main?: string | null;
};

const getProductImageURL = (images: Media[]): string => {
  const imageTypes: ImageTypes = {};

  if (images?.length) {
    for (const image of images) {
      if (image.roles?.includes('thumbnail')) {
        imageTypes.thumbnail = image.url;
      } else if (image.roles?.includes('small_image')) {
        imageTypes.small_image = image.url;
      } else if (image.roles?.includes('image')) {
        imageTypes.image = image.url;
      } else if (image.url?.includes('main')) {
        imageTypes.main = image.url;
      }
    }
  }

  return (
    imageTypes.thumbnail ??
    imageTypes.small_image ??
    imageTypes.image ??
    imageTypes.main ??
    ''
  );
};

export { getProductImageURL };
