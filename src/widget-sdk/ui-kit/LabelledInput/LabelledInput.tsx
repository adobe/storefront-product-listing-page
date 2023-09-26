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
        className="ds-sdk-labelled-input__input focus:ring-0 h-md w-md border-0 cursor-pointer accent-gray-600 min-w-[16px]"
        checked={checked}
        aria-checked={checked}
        onInput={onChange}
        value={value}
      />
      <label
        htmlFor={name}
        className="ds-sdk-labelled-input__label ml-sm block-display text-sm font-light text-gray-700 cursor-pointer"
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
