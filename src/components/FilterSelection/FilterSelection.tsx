import { FunctionComponent } from 'preact';

import PlusIcon from '../../icons/plus.svg';


export type InputButtonGroupTitleSlot = (label: string) => FunctionComponent;

export interface FilterSelectionProps {
  title: string;
  inputGroupTitleSlot?: InputButtonGroupTitleSlot;
  handleFilter?: () => void;
}

export const FilterSelection: FunctionComponent<FilterSelectionProps> = ({
  title,
  inputGroupTitleSlot,
  handleFilter,
}) => {
  const handleOptions = () => {
    handleFilter?.();
  };

  return (
    <div className="ds-sdk-input py-md">
      {inputGroupTitleSlot ? (
        inputGroupTitleSlot(title)
      ) : (
        <div
          className="flex items-center gap-x-1 cursor-pointer"
          onClick={handleOptions}
        >
          <label className="ds-sdk-input__label text-neutral-900 font-headline-1 text-sm font-semibold cursor-pointer">
            {title}
          </label>
          <PlusIcon className="h-sm w-sm fill-neutral-800" />
        </div>
      )}
    </div>
  );
};
