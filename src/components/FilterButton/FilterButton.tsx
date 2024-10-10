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
        className="flex items-center bg-[#904745] text-white ring-black ring-opacity-5 text-sm rounded-md p-sm h-[32px]"
        onClick={displayFilter}
      >
        {translation.Filter.title?.toUpperCase()}
      </button>
    </div>
  ) : (
    <div className="ds-sdk-filter-button-desktop w-[14rem]">
      <button
        className="flex items-center bg-[#904745] text-white ring-black ring-opacity-5 rounded-md p-sm text-sm font-['FuturaBT-Light']"
        onClick={displayFilter}
      >
        {title?.toUpperCase()}
      </button>
    </div>
  );
};
