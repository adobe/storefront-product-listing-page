/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';
import { useEffect, useState } from 'react';

import { SwatchValues } from '../../types/interface';
import { SwatchButton } from '../SwatchButton';

export interface SwatchButtonGroupProps {
  isSelected: (id: string) => boolean | undefined;
  swatches: SwatchValues[];
  showMore: () => any;
  productUrl: string;
  onClick: (optionIds: string[], sku: string) => any;
  sku: string;
  onMouseEnter?: (optionIds: string[], sku: string) => void;
  onMouseLeave?: () => void;
}

export const SwatchButtonGroup: FunctionComponent<SwatchButtonGroupProps> = ({
  isSelected,
  swatches,
  showMore,
  productUrl,
  onMouseEnter,
  onMouseLeave,
  onClick,
  sku
}: SwatchButtonGroupProps) => {
  const [visibleCount, setVisibleCount] = useState<number|null>(null);
  const swatchButtonContainerRef = useRef<HTMLDivElement>(null);
  const swatchButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (swatchButtonContainerRef.current && swatchButtonRef.current) {
        const containerWidth = swatchButtonContainerRef.current.offsetWidth;
        const swatchWidth = swatchButtonRef.current.offsetWidth;
        const visibleSwatches = Math.floor(containerWidth / swatchWidth);
        setVisibleCount(visibleSwatches); 
      }
    };

    updateVisibleCount();

    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const moreSwatches = visibleCount === null ? false : swatches.length > visibleCount;
  const numberOfOptions = moreSwatches && visibleCount !== null ? visibleCount - 1 : swatches.length;

  const swatchButtons = swatches.slice(0, numberOfOptions).map((swatch, index) => {
    const handleClick = (evt: Event) => {
      evt.preventDefault();
      evt.stopPropagation();

      onClick([swatch.id], sku);
    }

    const handleMouseEnter = () => {
      if (onMouseEnter) {
        onMouseEnter([swatch.id], sku);
      }
    }

    const checked = isSelected(swatch.id);
    const wrapperClasses = `ds-sdk-product-item__product-swatch-item text-sm text-brand-700${swatch.type == 'COLOR_HEX' ? ' mr-2': ''} ${checked ? 'selected' : ''}`;
    return (
      <div className={wrapperClasses} key={swatch.id} ref={index === 0  ? swatchButtonRef : null}>
          <SwatchButton
            id={swatch.id}
            value={swatch.value}
            type={swatch.type}
            checked={!!checked}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={handleClick}
          />
        </div>
      );
  });

  return (
    <div className="ds-sdk-product-item__product-swatch-group flex column items-center space-x-2" ref={swatchButtonContainerRef}>
      {moreSwatches ? (
        <div className="flex h-full w-full">
          {swatchButtons}
          <a href={productUrl as string} className="hover:no-underline">
            <div className="ds-sdk-product-item__product-swatch-item text-sm text-brand-700">
              <SwatchButton
                id={'show-more'}
                value={`+${swatches.length - numberOfOptions} more`}
                type={'TEXT'}
                checked={false}
                onClick={showMore}
              />
            </div>
          </a>
        </div>
      ) : swatchButtons}
    </div>
  );
};
