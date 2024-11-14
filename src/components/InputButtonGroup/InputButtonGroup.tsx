/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { ChangeEvent, useState } from 'preact/compat';

import { useProducts, useTranslation } from '../../context';
import PlusIcon from '../../icons/plus.svg';
import { BOOLEAN_NO, BOOLEAN_YES } from '../../utils/constants';
import { LabelledInput } from '../LabelledInput';

export type InputButtonGroupOnChangeProps = {
  value: string;
  selected?: boolean;
};

export type InputButtonGroupOnChange = (
  arg0: InputButtonGroupOnChangeProps
) => void;
export type InputButtonGroupTitleSlot = (label: string) => FunctionComponent;
export type Bucket = {
  title: string;
  id?: string;
  count: number;
  to?: number;
  from?: number;
  name?: string;
  __typename: 'ScalarBucket' | 'RangeBucket' | 'CategoryView';
};
export interface InputButtonGroupProps {
  title: string;
  attribute: string;
  buckets: Bucket[];
  isSelected: (title: string) => boolean | undefined;
  onChange: InputButtonGroupOnChange;
  type: 'radio' | 'checkbox';
  inputGroupTitleSlot?: InputButtonGroupTitleSlot;
}

const numberOfOptionsShown = 5;
export const InputButtonGroup: FunctionComponent<InputButtonGroupProps> = ({
  title,
  attribute,
  buckets,
  isSelected,
  onChange,
  type,
  inputGroupTitleSlot,
}) => {
  const translation = useTranslation();
  const productsCtx = useProducts();

  const [showMore, setShowMore] = useState(
    buckets.length < numberOfOptionsShown
  );

  const numberOfOptions = showMore ? buckets.length : numberOfOptionsShown;

  const onInputChange = (title: string, e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      value: title,
      selected: (e?.target as HTMLInputElement)?.checked,
    });
  };

  const formatLabel = (title: string, bucket: Bucket) => {
    if (bucket.__typename === 'RangeBucket') {
      const currencyRate = productsCtx.currencyRate
        ? productsCtx.currencyRate
        : '1';
      const currencySymbol = productsCtx.currencySymbol
        ? productsCtx.currencySymbol
        : '$';
      const label = `${currencySymbol}${
        bucket?.from &&
        parseFloat(currencyRate) * parseInt(bucket.from.toFixed(0), 10)
          ? (
              parseFloat(currencyRate) * parseInt(bucket.from.toFixed(0), 10)
            ).toFixed(2)
          : 0
      }${
        bucket?.to &&
        parseFloat(currencyRate) * parseInt(bucket.to.toFixed(0), 10)
          ? ` - ${currencySymbol}${(
              parseFloat(currencyRate) * parseInt(bucket.to.toFixed(0), 10)
            ).toFixed(2)}`
          : translation.InputButtonGroup.priceRange
      }`;
      return label;
    } else if (bucket.__typename === 'CategoryView') {
      return productsCtx.categoryPath
        ? bucket.name ?? bucket.title
        : bucket.title;
    } else if (bucket.title === BOOLEAN_YES) {
      return title;
    } else if (bucket.title === BOOLEAN_NO) {
      const excludedMessageTranslation =
        translation.InputButtonGroup.priceExcludedMessage;
      const excludedMessage = excludedMessageTranslation.replace(
        '{title}',
        `${title}`
      );
      return excludedMessage;
    }
    return bucket.title;
  };

  return (
    <div className="ds-sdk-input">
      {inputGroupTitleSlot ? (
        inputGroupTitleSlot(title)
      ) : (
        <label className="ds-sdk-input__label text-[1rem] font-normal text-gray-900 font-['FuturaBT-Medium']">
          {title}
        </label>
      )}
      <fieldset className="ds-sdk-input__options mt-[1.25rem]">
        <div className="space-y-2">
          {buckets.slice(0, numberOfOptions).map((option) => {
            if (!option.title) {
              return null;
            }
            const checked = isSelected(option.title);
            const noShowPriceBucketCount = option.__typename === 'RangeBucket';
            return (
              <LabelledInput
                key={formatLabel(title, option)}
                name={`${option.title}-${attribute}`}
                attribute={attribute}
                label={formatLabel(title, option)}
                checked={!!checked}
                value={option.title}
                count={noShowPriceBucketCount ? null : option.count}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onInputChange(option.title, e)
                }
                type={type}
              />
            );
          })}
          {!showMore && buckets.length > numberOfOptionsShown && (
            <div
              className="ds-sdk-input__fieldset__show-more flex items-center text-gray-700 cursor-pointer pt-[1.5rem]"
              onClick={() => setShowMore(true)}
            >
              <PlusIcon className="h-[1.2rem] w-[1.2rem] fill-[#904745]" />
              <button
                type="button"
                className="ml-sm text-[#904745] font-light cursor-pointer border-none bg-transparent hover:border-none	hover:bg-transparent focus:border-none focus:bg-transparent active:border-none active:bg-transparent active:shadow-none text-[0.875rem]"
              >
                {translation.InputButtonGroup.showmore}
              </button>
            </div>
          )}
        </div>
      </fieldset>
      <div className="ds-sdk-input__border border-t my-[1.3rem] border-gray-200" />
    </div>
  );
};
