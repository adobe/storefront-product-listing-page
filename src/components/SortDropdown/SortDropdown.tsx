/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import { useTranslation } from '../../context/translation';
import { useAccessibleDropdown } from '../../hooks/useAccessibleDropdown';
import Chevron from '../../icons/chevron.svg';
import SortIcon from '../../icons/sort.svg';
import { SortOption } from '../../types/interface';

export interface SortDropdownProps {
  value: string;
  sortOptions: SortOption[];
  onChange: (sortBy: string) => void;
}

export const SortDropdown: FunctionComponent<SortDropdownProps> = ({
  value,
  sortOptions,
  onChange,
}: SortDropdownProps) => {
  const sortOptionButton = useRef<HTMLButtonElement | null>(null);
  const sortOptionMenu = useRef<HTMLDivElement | null>(null);

  const selectedOption = sortOptions.find((e) => e.value === value);

  const translation = useTranslation();
  const sortOptionTranslation = translation.SortDropdown.option;
  const sortOption = sortOptionTranslation.replace(
    '{selectedOption}',
    `${selectedOption?.label}`
  );

  const {
    isDropdownOpen,
    setIsDropdownOpen,
    activeIndex,
    setActiveIndex,
    select,
    setIsFocus,
    listRef,
  } = useAccessibleDropdown({
    options: sortOptions,
    value,
    onChange,
  });

  useEffect(() => {
    const menuRef = sortOptionMenu.current;
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
  }, [sortOptionMenu]);

  return (
    <>
      <div
        ref={sortOptionMenu}
        class="flex shrink-0 ds-sdk-sort-dropdown relative inline-block text-left bg-neutral-50 h-[32px] z-9"
      >
        <label className="ds-sdk-input__label w-32 shrink-0 text-base font-normal text-neutral-900">
          {translation.SortDropdown.title}:
        </label>
        <button
          className="group flex justify-center items-center hover:cursor-pointer text-brand-700 border-brand-700 outline-brand-700 rounded-3 border-3 bg-background h-full w-full px-sm font-button-2"
          ref={sortOptionButton}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          onFocus={() => setIsFocus(false)}
          onBlur={() => setIsFocus(false)}
        >
          <SortIcon className="h-md w-md mr-sm stroke-brand-700 m-auto" />
          <span className="font-button-2">
            {selectedOption ? sortOption : translation.SortDropdown.title}
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
            tabIndex={-1}
            className="ds-sdk-sort-dropdown__items origin-top-right absolute hover:cursor-pointer right-0 w-full rounded-2 shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none mt-2 z-20"
          >
            {sortOptions.map((option, i) => (
              <li
                key={i}
                aria-selected={option.value === selectedOption?.value}
                onMouseOver={() => setActiveIndex(i)}
                className={`py-xs hover:bg-neutral-200 hover:text-neutral-900 ${
                  i === activeIndex ? 'bg-neutral-200 text-neutral-900' : ''
                }}`}
              >
                <a
                  className={`ds-sdk-sort-dropdown__items--item block-display px-md py-sm text-sm mb-0
              no-underline active:no-underline focus:no-underline hover:no-underline
              hover:text-neutral-900 ${
                option.value === selectedOption?.value
                  ? 'ds-sdk-sort-dropdown__items--item-selected font-semibold text-neutral-900'
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
