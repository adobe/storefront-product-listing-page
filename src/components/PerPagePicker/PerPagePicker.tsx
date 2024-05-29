/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionalComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import { useAccessibleDropdown } from '../../hooks/useAccessibleDropdown';
import Chevron from '../../icons/chevron.svg';
import { PageSizeOption } from '../../types/interface';

export interface PerPagePickerProps {
  value: number;
  pageSizeOptions: PageSizeOption[];
  onChange: (pageSize: number) => void;
}

export const PerPagePicker: FunctionalComponent<PerPagePickerProps> = ({
  value,
  pageSizeOptions,
  onChange,
}: PerPagePickerProps) => {
  const pageSizeButton = useRef<HTMLButtonElement | null>(null);
  const pageSizeMenu = useRef<HTMLDivElement | null>(null);

  const selectedOption = pageSizeOptions.find((e) => e.value === value);

  const {
    isDropdownOpen,
    setIsDropdownOpen,
    activeIndex,
    setActiveIndex,
    select,
    setIsFocus,
    listRef,
  } = useAccessibleDropdown({
    options: pageSizeOptions,
    value,
    onChange,
  });

  useEffect(() => {
    const menuRef = pageSizeMenu.current;
    const handleBlur = () => {
      setIsFocus(false);
      setIsDropdownOpen(false);
    };

    const handleFocus = () => {
      if (menuRef?.parentElement?.querySelector(':hover') !== menuRef) {
        setIsFocus(false);
        setIsDropdownOpen(false);
      }
    };

    menuRef?.addEventListener('blur', handleBlur);
    menuRef?.addEventListener('focusin', handleFocus);
    menuRef?.addEventListener('focusout', handleFocus);

    return () => {
      menuRef?.removeEventListener('blur', handleBlur);
      menuRef?.removeEventListener('focusin', handleFocus);
      menuRef?.removeEventListener('focusout', handleFocus);
    };
  }, [pageSizeMenu]);

  return (
    <>
      <div
        ref={pageSizeMenu}
        className="ds-sdk-per-page-picker ml-2 mr-2 relative inline-block text-left h-[32px] bg-neutral-50 border-brand-700 outline-brand-700 rounded-3 border-3"
      >
        <button
          className="group flex justify-center items-center text-brand-700 hover:cursor-pointer border-none bg-background h-full w-full px-sm"
          ref={pageSizeButton}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onFocus={() => setIsFocus(false)}
          onBlur={() => setIsFocus(false)}
        >
          <span className="font-button-2">
            {selectedOption ? `${selectedOption.label}` : '24'}
          </span>
          <Chevron
            className={`flex-shrink-0 m-auto ml-sm h-md w-md stroke-1 stroke-brand-700 ${
              isDropdownOpen ? '' : 'rotate-180'
            }`}
          />
        </button>
        {isDropdownOpen && (
          <ul
            ref={listRef}
            className="ds-sdk-per-page-picker__items origin-top-right absolute hover:cursor-pointer right-0 w-full rounded-2 shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none mt-2 z-20"
          >
            {pageSizeOptions.map((option, i) => (
              <li
                key={i}
                aria-selected={option.value === selectedOption?.value}
                onMouseOver={() => setActiveIndex(i)}
                className={`py-xs hover:bg-neutral-200 hover:text-neutral-900 ${
                  i === activeIndex ? 'bg-neutral-200 text-neutral-900' : ''
                }}`}
              >
                <a
                  className={`ds-sdk-per-page-picker__items--item block-display px-md py-sm text-sm mb-0
              no-underline active:no-underline focus:no-underline hover:no-underline
              hover:text-neutral-900 ${
                option.value === selectedOption?.value
                  ? 'ds-sdk-per-page-picker__items--item-selected font-semibold text-neutral-900'
                  : 'font-normal text-neutral-800'
              }`}
                  onClick={() => select(option.value)}
                >
                  {option.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
