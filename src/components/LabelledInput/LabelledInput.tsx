/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { Input } from "postcss";

export type LabelledInputOnChangeProps = {
  value: string;
  selected?: boolean;
  type?: string;
};

// Maybe someday extend the `type` field to allow more inputs like `range` or `time`
export interface LabelledInputProps {
  checked: boolean;
  name: string;
  attribute: string;
  type: 'checkbox' | 'radio' | 'link';
  onChange: (e: LabelledInputOnChangeProps) => void;
  label: string;
  value: string;
  count?: number | null;
  isRangeInput?: boolean | null;
}

export const LabelledInput: FunctionComponent<LabelledInputProps> = ({
  type,
  checked,
  onChange,
  name,
  label,
  attribute,
  value,
  count,
  isRangeInput,
}) => {
  const href = `${window.location.origin}/${window.location.pathname.split('/')[1]}/${value}`

  const getRangeValue = (rangePosition: number) => {
    let params = new URLSearchParams(document.location.search)

    if (params.has('price')) {
      return (params.get('price') as string).split('--')[rangePosition]
    }

    return '';
  }
  const onPriceRange = (event: Event) => {
    event.preventDefault();
    const fromPrice = (document.querySelector('#from-price') as HTMLInputElement)?.value || '0'
    const toPrice = (document.querySelector('#to-price') as HTMLInputElement)?.value || '999'

    onChange({value: `${fromPrice}.0-${toPrice}.0`, selected: true, type})
  }

  return (
    type === 'link' || attribute === 'categories' ? (
      <div className="ds-sdk-labelled-input flex gap-4 text-[12px] leading-12 items-center">
        <a href={href}
           onClick={(e) => {
             if (type === 'link') {
               e.preventDefault();
               onChange({value, type})
             }
           }}>
          {label}
          {count && (
            <span className="text-[12px] text-neutral-800 ml-1 font-details-overline">
                {`(${count})`}
                </span>
          )}
        </a>
      </div>
    ) : (
      <>
        {isRangeInput && (
          <div className="ds-sdk-labelled-input flex gap-4 items-center">
            <input className={'range-input text-black text-center text-[12px] leading-12'} type={'number'} value={getRangeValue(0)} id={'from-price'}/>
            <input className={'range-input text-black text-center text-[12px] leading-12'} type={'number'} value={getRangeValue(1)} id={'to-price'}/>

            <label
              onClick={onPriceRange}
              htmlFor={`from-price`}
              className="button primary text-[12px] font-normal m-0 py-3 px-4 cursor-pointer price-range-submit"
            >
              {label}
              {count && (
                <span className="text-[12px] text-neutral-800 ml-1 font-details-overline">
                    {`(${count})`}
                  </span>
              )}
            </label>
          </div>
        )}

        {!isRangeInput && (
          <div className="ds-sdk-labelled-input flex gap-4 items-center">
            <input
              id={name}
              name={
                type === 'checkbox'
                  ? `checkbox-group-${attribute}`
                  : `radio-group-${attribute}`
              }
              type={type}
              className="ds-sdk-labelled-input__input focus:ring-0 h-md w-md border-0 cursor-pointer accent-neutral-800 min-w-[16px]"
              checked={checked}
              aria-checked={checked}
              onInput={(e) => onChange({value, selected: e.currentTarget.checked, type})}
              value={value}
            />
            <label
              htmlFor={name}
              className="ds-sdk-labelled-input__label block-display h-max-content text-[14px] leading-12 cursor-pointer"
            >
              {label}
              {count && (
                <span className="text-[14px] ml-1 font-details-overline">
                {`(${count})`}
              </span>
              )}
            </label>
          </div>
        )}
      </>
    )
  );
};
