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
import { SortOption } from '../../types/interface';

export interface SortDropdownProps {
  value: string;
  sortOptions: SortOption[];
  onChange: (sortBy: string) => void;
  mobile?: boolean;
}

export const toggleFilters = (event: Omit<MouseEvent, "currentTarget"> & {
  readonly currentTarget: HTMLLabelElement
}) => {
  const clicked = event.target;
  const toBeActiveFilterBlock = clicked.nextElementSibling;
  const parrentDiv = clicked.closest('.ds-sdk-input')
  const borderDiv = parrentDiv.querySelector('.ds-sdk-input__border')

  if (toBeActiveFilterBlock.classList.contains('none-display')) {
    const currentFilterBlock = clicked.closest('form').querySelector('fieldset:not(.none-display)')
    currentFilterBlock?.classList.add('none-display')
    currentFilterBlock?.nextElementSibling?.classList.remove('mt-md')
    toBeActiveFilterBlock?.classList.remove('none-display')
    borderDiv.classList.add('mt-md');
    parrentDiv.classList.add('active');
  } else {
    toBeActiveFilterBlock?.classList.add('none-display')
    borderDiv.classList.remove('mt-md');
    parrentDiv.classList.remove('active');
  }
}

export const SortDropdown: FunctionComponent<SortDropdownProps> = ({
  value,
  sortOptions,
  onChange,
}: SortDropdownProps) => {
  const sortOptionMenu = useRef<HTMLDivElement | null>(null);
  const selectedOption = sortOptions.find((e) => e.value === value);
  const translation = useTranslation();
  const {
    setIsDropdownOpen,
    select,
    setIsFocus,
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
      <div ref={sortOptionMenu} class="ds-sdk-input">
        <label
          className={'ds-sdk-input__label text-neutral-900 font-headline-1 text-sm font-semibold py-md w-full h-full ib-display cursor-pointer flex flex-row'}
          onClick={(event) => toggleFilters(event)}
        >
          {translation.SortDropdown.title}
        </label>
        <fieldset className={'ds-sdk-input__options mt-4 md:mt-0 none-display'}>
          <div className={'space-y-4'}>
            {sortOptions.map((option, i) => (
              <div
                key={`div-${i}`}
                className={'ds-sdk-labelled-input flex gap-4 items-center'}>
                <input key={`input-${i}`}
                       type={'radio'}
                       value={'option.value'}
                       checked={option.value === selectedOption?.value}
                       onClick={() => select(option.value)}
                       className={'ds-sdk-labelled-input__input focus:ring-0 h-md w-md border-0 cursor-pointer accent-neutral-800 min-w-[16px]'}
                />
                <label key={`label-${i}`}
                       for={`sortby-${  option.value}`}
                       onClick={() => select(option.value)}
                       className={'ds-sdk-labelled-input__label block-display h-max-content leading-12 text-[12px] cursor-pointer'}
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
        <div className={'ds-sdk-input__border border-t border-neutral-500'} />
      </div>
    </>
  );
};
