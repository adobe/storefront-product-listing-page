/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { SetStateAction, useState } from 'react';

export interface ImageCarouselProps {
  images: string[];
  productName: string;
}

export const ImageCarousel: FunctionComponent<ImageCarouselProps> = ({
  images,
  productName,
}) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [swipeIndex, setSwipeIndex] = useState(0);
  const cirHandler = (index: SetStateAction<number>) => {
    setCarouselIndex(index);
  };

  const prevHandler = () => {
    if (carouselIndex === 0) {
      setCarouselIndex(0);
    } else {
      setCarouselIndex((prev) => prev - 1);
    }
  };
  const nextHandler = () => {
    if (carouselIndex === images.length - 1) {
      setCarouselIndex(0);
    } else {
      setCarouselIndex((prev) => prev + 1);
    }
  };

  return (
    <>
      <div class="ds-sdk-product-image-carousel max-w-2xl m-auto">
        <div
          className="flex flex-nowrap overflow-hidden rounded-lg relative rounded-lg w-full h-full "
          onTouchStart={(e) => setSwipeIndex(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const endIndex = e.changedTouches[0].clientX;
            if (swipeIndex > endIndex) {
              nextHandler();
            } else if (swipeIndex < endIndex) {
              prevHandler();
            }
          }}
        >
          {images.map((item, index) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <>
                <img
                  src={item}
                  key={index}
                  alt={productName}
                  loading="eager"
                  className="max-h-[45rem] h-full w-full object-cover object-center lg:h-full lg:w-full"
                  style={{
                    transform: `translate(-${carouselIndex * 100}%)`,
                    transition: `1s cubic-bezier(0.39, 0.575, 0.565, 1)`,
                  }}
                />
              </>
            );
          })}
        </div>
        {images.length > 1 && (
          <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-0 left-1/2 pb-2 ">
            {images.map((_item, index) => {
              return (
                <span
                  key={index}
                  style={
                    carouselIndex === index
                      ? {
                          width: `12px`,
                          height: `12px`,
                          'border-radius': `50%`,
                          border: `1px solid black`,
                          cursor: `pointer`,
                          'background-color': `#252525`,
                        }
                      : {
                          width: `12px`,
                          height: `12px`,
                          'border-radius': `50%`,
                          border: `1px solid silver`,
                          cursor: `pointer`,
                          'background-color': `silver`,
                        }
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    cirHandler(index);
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
