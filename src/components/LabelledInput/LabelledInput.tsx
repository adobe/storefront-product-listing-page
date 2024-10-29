/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { ChangeEvent } from 'preact/compat';
import {useSensor} from '../../context';

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
    const { screenSize } = useSensor();
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
        className={screenSize.mobile?"ds-sdk-labelled-input__input focus:ring-0 h-md w-md border-0 cursor-pointer accent-[#904745] min-w-[16px] before:left-[2rem]":
            "ds-sdk-labelled-input__input focus:ring-0 h-md w-md text-[0.75rem] border-0 cursor-pointer accent-[#904745] min-w-[16px] before:left-[10px]"}
        checked={checked}
        aria-checked={checked}
        onInput={onChange}
        value={value}
      />
      <label
        htmlFor={name}
        className="ds-sdk-labelled-input__label ml-sm mb-0 block-display text-[1rem] text-[#171513] font-['FuturaBT-Light'] cursor-pointer"
      >
        {label}
        {count && (
          <span className="text-[12px] font-light text-gray-700 ml-1">
            {`(${count})`}
          </span>
        )}
      </label>
    </div>
  );
};
