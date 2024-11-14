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
    isFilterActive?: boolean;
    isFiltersOpen?: boolean;
}
export const FilterButton: FunctionComponent<FilterButtonProps> = ({
  displayFilter,
  type,
  title,
  isFiltersOpen
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
        className={`flex items-center ${isFiltersOpen ? 'bg-black' : 'bg-[#904745]'} text-white ring-black ring-opacity-5 text-[0.875rem] rounded-md p-sm h-[32px] font-['FuturaBT-Light'] px-[0.75rem]`}
        onClick={() => handleClick()}
        ref={mobileFilterButtonRef}
      >
        {translation.Filter.title?.toUpperCase()}
      </button>
    </div>
  ) : (
    <div className="ds-sdk-filter-button-desktop w-[14rem]">
      <button
          className={`flex items-center ${isFiltersOpen ? 'bg-black' : 'bg-[#904745]'} text-white ring-black ring-opacity-5 py-[0.45rem] rounded-md p-sm text-[0.875rem] font-['FuturaBT-Light']`}
        onClick={() => handleClick()}
        ref={mobileFilterButtonRef}
      >
        {title?.toUpperCase()}
      </button>
    </div>
  );
};
