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
  carouselIndex: number;
  setCarouselIndex: (carouselIndex: number | SetStateAction<number>) => void;
}

export const ImageCarousel: FunctionComponent<ImageCarouselProps> = ({
  images,
  productName,
  carouselIndex,
  setCarouselIndex,
}) => {
  const [swipeIndex, setSwipeIndex] = useState(0);
  const cirHandler = (index: SetStateAction<number>) => {
    setCarouselIndex(index);
  };

  const prevHandler = () => {
    if (carouselIndex === 0) {
      setCarouselIndex(0);
    } else {
      setCarouselIndex((prev: number) => prev - 1);
    }
  };
  const nextHandler = () => {
    if (carouselIndex === images.length - 1) {
      setCarouselIndex(0);
    } else {
      setCarouselIndex((prev: number) => prev + 1);
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
          <div className="overflow-hidden relative">
            <div
              className={`flex transition ease-out duration-40`}
              style={{
                transform: `translateX(-${carouselIndex * 100}%)`,
              }}
            >
              {images.map((item, index) => {
                return <img src={item} key={index} alt={productName} />;
              })}
            </div>
          </div>
        </div>
        {images.length > 1 && (
          <div className="absolute z-1 flex space-x-3 -translate-x-1/2 bottom-0 left-1/2 pb-2 ">
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
