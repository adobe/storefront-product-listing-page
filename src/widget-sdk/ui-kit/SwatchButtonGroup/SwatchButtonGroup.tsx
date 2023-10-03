import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { SwatchValues } from '../../types/interface';
import { SwatchButton } from '../../ui-kit';

export interface SwatchButtonGroupProps {
  isSelected: (id: string) => boolean | undefined;
  swatches: SwatchValues[];
  showMore: boolean;
  onClick: (optionIds: string[], sku: string) => any;
  sku: string;
}

const MAX_SWATCHES = 3;

export const SwatchButtonGroup: FunctionComponent<SwatchButtonGroupProps> = ({
  isSelected,
  swatches,
  showMore,
  onClick,
  sku,
}: SwatchButtonGroupProps) => {
  const numberOfOptions = showMore ? swatches.length : MAX_SWATCHES;
  return (
    <div className="flex column items-center space-x-4">
      {swatches.slice(0, numberOfOptions).map((swatch) => {
        const checked = isSelected(swatch.id);
        return (
          swatch.type == 'COLOR_HEX' && (
            <div className="ds-sdk-product-item__product-swatch-item text-sm text-primary">
              <SwatchButton
                id={swatch.id}
                value={swatch.value}
                type={swatch.type}
                checked={!!checked}
                onClick={() => onClick([swatch.id], sku)}
              />
            </div>
          )
        );
      })}
    </div>
  );
};
