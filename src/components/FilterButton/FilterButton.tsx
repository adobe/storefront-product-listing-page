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
    <div className="ds-sdk-filter-button">
      <button
        className="flex items-center bg-background ring-black ring-opacity-5 rounded-2 p-sm font-button-2 outline outline-brand-700 h-[32px]"
        onClick={displayFilter}
      >
        <AdjustmentsIcon className="w-md" />
        <span className="font-button-2">{translation.Filter.title}</span>
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
