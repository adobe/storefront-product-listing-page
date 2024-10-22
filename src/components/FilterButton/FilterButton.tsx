/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useTranslation } from '../../context/translation';

import {useEffect, useState, useRef} from 'preact/compat';

export interface FilterButtonProps {
    displayFilter: () => void;
    type: string;
    title?: string;
    isFilterActive?:boolean
}
export const FilterButton: FunctionComponent<FilterButtonProps> = ({
  displayFilter,
  type,
  title,
  isFilterActive,
}: FilterButtonProps) => {
  const translation = useTranslation();
  const mobileFilterButtonRef = useRef<HTMLButtonElement | null>(null);
  const handleClick = (): void => {
      displayFilter();
      if (mobileFilterButtonRef && mobileFilterButtonRef.current) {
          if (mobileFilterButtonRef.current.classList.contains('bg-black')) {
               mobileFilterButtonRef.current.classList.remove('bg-black');
               mobileFilterButtonRef.current.classList.add('bg-[#904745]');
          } else {
              mobileFilterButtonRef.current.classList.remove('bg-[#904745]');
              mobileFilterButtonRef.current.classList.add('bg-black');
          }
      }
  };

    return type == 'mobile' ? (
    <div className="ds-sdk-filter-button">
      <button
        className={`flex items-center ${isFilterActive?'bg-black':'bg-[#904745]'} text-white ring-black ring-opacity-5 text-sm rounded-md p-sm h-[32px] font-['FuturaBT-Light'] px-[0.75rem]`}
        onClick={() => handleClick()}
        ref={mobileFilterButtonRef}
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
