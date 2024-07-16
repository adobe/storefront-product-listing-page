/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { SwatchValues } from '../../types/interface';
import { SwatchButton } from '../SwatchButton';

export interface SwatchButtonGroupProps {
  isSelected: (id: string) => boolean | undefined;
  swatches: SwatchValues[];
  showMore: () => any;
  productUrl: string;
  onClick: (optionIds: string[], sku: string) => any;
  sku: string;
  maxSwatches?: number;
  onMouseEnter?: (optionIds: string[], sku: string) => void;
  onMouseLeave?: () => void;
}

const MAX_SWATCHES = 4;

export const SwatchButtonGroup: FunctionComponent<SwatchButtonGroupProps> = ({
  isSelected,
  swatches,
  showMore,
  productUrl,
  onMouseEnter,
  onMouseLeave,
  onClick,
  sku,
  maxSwatches = MAX_SWATCHES,
}: SwatchButtonGroupProps) => {
  const moreSwatches = swatches.length > maxSwatches;
  const numberOfOptions = moreSwatches ? maxSwatches - 1 : swatches.length;

  return (
    <div className="ds-sdk-product-item__product-swatch-group flex column items-center space-x-2">
      {moreSwatches ? (
        <div className="flex h-full w-full">
          {swatches.slice(0, numberOfOptions).map((swatch) => {
            const checked = isSelected(swatch.id);
            const wrapperClasses = `ds-sdk-product-item__product-swatch-item text-sm text-brand-700${swatch.type == 'COLOR_HEX' ? ' mr-2': ''} ${checked ? 'selected' : ''}`;
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

            return (
              <div className={wrapperClasses} key={swatch.id}>
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
          })}
          <a href={productUrl as string} className="hover:no-underline">
            <div className="ds-sdk-product-item__product-swatch-item text-sm text-brand-700">
              <SwatchButton
                id={'show-more'}
                value={`+ ${swatches.length - numberOfOptions} more`}
                type={'TEXT'}
                checked={false}
                onClick={showMore}
              />
            </div>
          </a>
        </div>
      ) : (
        swatches.slice(0, numberOfOptions).map((swatch) => {
          const checked = isSelected(swatch.id);
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

          return (
            <div className={`ds-sdk-product-item__product-swatch-item text-sm text-brand-700 ${checked ? 'selected' : ''}`} key={swatch.id}>
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
        })
      )}
    </div>
  );
};
