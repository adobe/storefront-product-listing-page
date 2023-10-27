/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { Menu, Transition } from '@headlessui/react';
import { Fragment, FunctionalComponent, h } from 'preact';
import { useState } from 'preact/hooks';

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
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const handleSelection = (val: number) => {
    setSelected(val);
    onChange(val);
  };

  const selectedOption = pageSizeOptions.find((e) => e.value === selected);

  return h(
    Menu,
    {
      as: 'div',
      className:
        'ds-sdk-per-page-picker ml-2 mr-2 relative inline-block text-left bg-gray-100 rounded-md outline outline-1 outline-gray-200 hover:outline-gray-600 h-[32px]',
    },
    [
      h(
        Menu.Button,
        {
          className:
            'group flex justify-center items-center font-normal text-sm text-gray-700 rounded-md hover:cursor-pointer border-none bg-transparent hover:border-none hover:bg-transparent focus:border-none focus:bg-transparent active:border-none active:bg-transparent active:shadow-none h-full w-full px-sm',
          onClick: () => setIsOpen(!isOpen),
        },
        [
          h(Fragment, {}, [
            selectedOption ? `${selectedOption.label}` : '24',
            isOpen
              ? h(Chevron, {
                  className:
                    'flex-shrink-0 m-auto ml-sm h-md w-md stroke-1 stroke-gray-600 rotate-180',
                })
              : h(Chevron, {
                  className:
                    'flex-shrink-0 m-auto ml-sm h-md w-md stroke-1 stroke-gray-600',
                }),
          ]),
        ]
      ),
      h(
        Transition,
        {
          // as: Fragment,
          enter: 'transition ease-out duration-100',
          enterFrom: 'transform opacity-0 scale-95',
          enterTo: 'transform opacity-100 scale-100',
          leave: 'transition ease-in duration-75',
          leaveFrom: 'transform opacity-100 scale-100',
          leaveTo: 'transform opacity-0 scale-95',
        },
        [
          h(
            Menu.Items,
            {
              // static: true,
              className:
                'ds-sdk-per-page-picker__items origin-top-right absolute hover:cursor-pointer right-0 w-full rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none mt-2 z-20',
            },
            [
              h('div', { className: 'py-xs' }, [
                ...pageSizeOptions.map((option) =>
                  h(
                    Menu.Item,
                    { key: option.value },
                    ({ active }: { active: boolean }) =>
                      h(
                        'a',
                        {
                          className: `ds-sdk-per-page-picker__items--item block-display px-md py-sm text-sm mb-0
                                              no-underline active:no-underline focus:no-underline hover:no-underline
                                              hover:text-gray-800 ${
                                                option.value === selected
                                                  ? 'ds-sdk-per-page-picker__items--item-selected font-semibold text-gray-900'
                                                  : 'font-normal text-gray-800'
                                              } ${
                            active
                              ? 'ds-sdk-per-page-picker__items--item-active bg-gray-100 text-gray-900'
                              : ''
                          }`,
                          onClick: () => handleSelection(option.value),
                        },
                        option.label
                      )
                  )
                ),
              ]),
            ]
          ),
        ]
      ),
    ]
  );
};
