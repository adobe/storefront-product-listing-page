/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { ChangeEvent } from 'preact/compat';

// Maybe someday extend the `type` field to allow more inputs like `range` or `time`
export interface LabelledInputProps {
  checked: boolean;
  name: string;
  attribute: string;
  type: 'checkbox' | 'radio';
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  value: string;
  count?: number | null;
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
}) => {
  return (
    <div className="ds-sdk-labelled-input flex items-center">
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
        onInput={onChange}
        value={value}
      />
      <label
        htmlFor={name}
        className="ds-sdk-labelled-input__label ml-sm block-display text-neutral-800 font-body-1-default cursor-pointer"
      >
        {label}
        {count && (
          <span className="text-[12px] text-neutral-800 ml-1 font-details-overline">
            {`(${count})`}
          </span>
        )}
      </label>
    </div>
  );
};
