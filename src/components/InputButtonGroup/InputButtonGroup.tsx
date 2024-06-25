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

  return (
    <div className="ds-sdk-input pt-md">
      {inputGroupTitleSlot ? (
        inputGroupTitleSlot(title)
      ) : (
        <label className="ds-sdk-input__label text-neutral-900 font-headline-1 text-sm font-semibold">
          {title}
        </label>
      )}
      <fieldset className="ds-sdk-input__options">
        <div className="space-y-4">
          {buckets.slice(0, numberOfOptions).map((option) => {
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
      <div className="ds-sdk-input__border border-t mt-md border-neutral-500" />
    </div>
  );
};
