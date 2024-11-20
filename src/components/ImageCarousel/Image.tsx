import { useEffect, useRef, useState } from 'preact/compat';

import { useIntersectionObserver } from '../../utils/useIntersectionObserver';

export const Image = ({
  image,
  alt,
  carouselIndex,
  index,
}: {
  image: { src: string; srcset: any } | string;
  alt: string;
  carouselIndex: number;
  index: number;
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const entry = useIntersectionObserver(imageRef, { rootMargin: '278px' });

  useEffect(() => {
    if (!entry) return;

    if (entry?.isIntersecting && index === carouselIndex) {
      setIsVisible(true);

      setImageUrl((entry?.target as HTMLElement)?.dataset.src || '');
    }
  }, [entry, carouselIndex, index, image]);

  return (
    <img
      className={`aspect-auto w-full h-auto ${
        isVisible ? 'visible' : 'invisible'
      }`}
      ref={imageRef}
      src={imageUrl}
      data-src={typeof image === 'object' ? image.src : image}
      srcset={typeof image === 'object' ? image.srcset : null}
      alt={alt}
    />
  );
};
