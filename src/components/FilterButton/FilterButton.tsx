/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useTranslation } from '../../context/translation';
import AdjustmentsIcon from '../../icons/adjustments.svg';

export interface FilterButtonProps {
  displayFilter: () => void;
  type: string;
  title?: string;
}
export const FilterButton: FunctionComponent<FilterButtonProps> = ({
  displayFilter,
  type,
  title,
}: FilterButtonProps) => {
  const translation = useTranslation();

  return type == 'mobile' ? (
    <div className="ds-sdk-filter-button flex justify-center items-center ">
      <button
        className="flex justify-center items-center gap-x-1 bg-black"
        onClick={displayFilter}
      >
        <AdjustmentsIcon className="w-md stroke-neutral-50" />
        <span className="text-white font-button-2 text-sm uppercase">{translation.Filter.title}</span>
      </button>
    </div>
  ) : (
    <div className="ds-sdk-filter-button-desktop">
      <button
        className="flex items-center bg-background ring-black ring-opacity-5 rounded-3 p-sm outline outline-brand-700 h-[32px]"
        onClick={displayFilter}
      >
        <span className="font-button-2">{title}</span>
      </button>
    </div>
  );
};
