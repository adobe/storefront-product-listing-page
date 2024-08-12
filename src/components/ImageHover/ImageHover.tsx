/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import './ImageHover.css';

export interface ImageCarouselProps {
  images: string[] | { src: string; srcset: any }[];
}

export const ImageHover: FunctionComponent<ImageCarouselProps> = ({
  images,
}) => {

    return (
      <>
        {images.length > 1 && (
          <link rel="preload" as="image" href={typeof images[1] === 'object' ? images[1].src : images[1]} />
        )}
          <meta itemProp="image" content={typeof images[0] === 'object' ? images[0].src : images[0]} />
        <div class="relative w-full pb-[122.22%]">
          <div class="ds-sdk-product-image-hover absolute h-full w-full m-auto bg-cover bg-no-repeat bg-position-center"
              style={{
                '--image-url': `url('${typeof images[0] === 'object' ? images[0].src : images[0]}')`,
                '--hover-url': `url('${typeof images[1] === 'object' ? images[1].src : images[1]}')`,
              }}
            />
        </div>
      </>
    );
};
