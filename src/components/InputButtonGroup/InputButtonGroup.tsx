import { FunctionComponent } from 'preact';
import { useState } from 'preact/compat';

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
  isHidden: boolean;
}

export const InputButtonGroup: FunctionComponent<InputButtonGroupProps> = ({
  title,
  attribute,
  buckets,
  isSelected,
  onChange,
  type,
  inputGroupTitleSlot,
  isHidden
}) => {
  const translation = useTranslation();
  const productsCtx = useProducts();

  const formatLabel = (title: string, bucket: Bucket) => {
    const {
      currencyRate = '1',
      currencySymbol = '$',
      categoryPath,
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
      return categoryPath ? bucket.name ?? bucket.title : bucket.title;
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

  const toggleFilters = (event) => {
    const clicked = event.target;
    const toBeActiveFilterBlock = clicked.nextElementSibling;
    const parrentDiv = clicked.closest('.ds-sdk-input')
    const borderDiv = parrentDiv.querySelector('.ds-sdk-input__border')

    if (toBeActiveFilterBlock.classList.contains('none-display')) {
      const currentFilterBlock = clicked.closest('form').querySelector('fieldset:not(.none-display)')
      currentFilterBlock?.classList.add('none-display')
      currentFilterBlock?.nextElementSibling?.classList.remove('mt-md')
      toBeActiveFilterBlock?.classList.remove('none-display')
      borderDiv.classList.add('mt-md');
      parrentDiv.classList.add('active');
    } else {
      toBeActiveFilterBlock?.classList.add('none-display')
      borderDiv.classList.remove('mt-md');
      parrentDiv.classList.remove('active');
    }
  }

  return (
    <div className="ds-sdk-input">
      {inputGroupTitleSlot ? (
        inputGroupTitleSlot(title)
      ) : (
          (isHidden ? (
              <label
                  className="ds-sdk-input__label text-neutral-900 font-headline-1 text-sm font-semibold py-md w-full h-full ib-display cursor-pointer flex flex-row"
                  onClick={toggleFilters}>
                {title}
              </label>
          ) : (
              <label className="ds-sdk-input__label text-neutral-900 font-headline-1 text-sm font-semibold py-md w-full h-full ib-display flex flex-row">{title}</label>
          ))
      )}
      <fieldset className={`ds-sdk-input__options mt-4 md:mt-0 ${isHidden ? 'none-display' : ''}`}>
        <div className="space-y-4">
          {buckets.map((option) => {
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
                onChange={onChange}
                type={type}
              />
            );
          })}
          {attribute === 'price' && (
              <LabelledInput
                name={`range-radio-${attribute}`}
                attribute={attribute}
                label={'Range price'}
                checked={false}
                value={'125.0-555.0'}
                count={null}
                onChange={onChange}
                type={type}
                isRangeInput={true}
              />
          )}
        </div>
      </fieldset>
      <div className="ds-sdk-input__border border-t border-neutral-500" />
    </div>
  );
};
