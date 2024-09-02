/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useState } from 'preact/compat';
import { Bucket } from 'src/types/interface';

import { useProducts, useTranslation } from '../../context';
import PlusIcon from '../../icons/plus.svg';
import { BOOLEAN_NO, BOOLEAN_YES } from '../../utils/constants';
import { LabelledInput } from '../LabelledInput';

export type FilterSelectionGroupOnChangeProps = {
  value: string;
  selected?: boolean;
  type?: string;
};

export type FilterSelectionGroupOnChange = (
  arg0: FilterSelectionGroupOnChangeProps
) => void;

export interface FilterSelectionGroupProps {
  title: string;
  attribute: string;
  buckets: Bucket[];
  isSelected: (title: string) => boolean | undefined;
  onChange: FilterSelectionGroupOnChange;
  type: 'radio' | 'checkbox' | 'link';
}

const numberOfOptionsShown = 5;

export const FilterSelectionGroup: FunctionComponent<
  FilterSelectionGroupProps
> = ({ title, attribute, buckets, isSelected, onChange, type }) => {
  const translation = useTranslation();
  const productsCtx = useProducts();

  const [showMore, setShowMore] = useState(
    buckets.length < numberOfOptionsShown
  );

  const numberOfOptions = showMore ? buckets.length : numberOfOptionsShown;

  const formatLabel = (title: string, bucket: Bucket) => {
    const {
      currencyRate = '1',
      currencySymbol = '$',
    } = productsCtx;

    const formatPrice = (value: number) =>
      (parseFloat(currencyRate) * value).toFixed(2);

    if (bucket.__typename === 'RangeBucket') {
      const fromPrice = bucket.from
        ? `${currencySymbol}${formatPrice(
            parseInt(bucket.from.toFixed(0), 10)
          )}`
        : '0';
      const toPrice = bucket.to
        ? ` - ${currencySymbol}${formatPrice(
            parseInt(bucket.to.toFixed(0), 10)
          )}`
        : translation.InputButtonGroup.priceRange;
      return `${fromPrice}${toPrice}`;
    }

    if (bucket.__typename === 'CategoryView') {
      return bucket.name ? bucket.name : bucket.title;
    }

    if (bucket.title === BOOLEAN_YES) {
      return title;
    }

    if (bucket.title === BOOLEAN_NO) {
      return translation.InputButtonGroup.priceExcludedMessage.replace(
        '{title}',
        title
      );
    }

    return bucket.title;
  };

  return (
    <div className="ds-sdk-input py-md">
      <fieldset className="ds-sdk-input__options">
        <div>
          {buckets.slice(0, numberOfOptions).map((option) => {
            const checked = isSelected(option.title);
            const noShowPriceBucketCount = option.__typename === 'RangeBucket';
            const value: string = option.__typename === 'CategoryView' && type === 'link' ? option.path || '' : option.title;
            return (
              <LabelledInput
                key={formatLabel(title, option)}
                name={`${option.title}-${attribute}`}
                attribute={attribute}
                label={formatLabel(title, option)}
                checked={!!checked}
                value={value}
                count={noShowPriceBucketCount ? null : option.count}
                onChange={onChange}
                type={type}
              />
            );
          })}
          {!showMore && buckets.length > numberOfOptionsShown && (
            <div
              className="ds-sdk-input__fieldset__show-more flex items-center text-neutral-800 cursor-pointer"
              onClick={() => setShowMore(true)}
            >
              <PlusIcon className="h-md w-md fill-neutral-800" />
              <button
                type="button"
                className="ml-sm cursor-pointer border-none bg-transparent hover:border-none	hover:bg-transparent focus:border-none focus:bg-transparent active:border-none active:bg-transparent active:shadow-none"
              >
                <span className="font-button-2 text-[12px]">
                  {translation.InputButtonGroup.showmore}
                </span>
              </button>
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
};
