import { Menu, Transition } from '@headlessui/react';
import { Fragment, FunctionComponent, h } from 'preact';
import { useContext, useState } from 'preact/hooks';

import { TranslationContext } from '../../../context/translation';
import Chevron from '../../icons/chevron.svg';
import SortIcon from '../../icons/sort.svg';
import { SortOption } from '../../utils/types';

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
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const handleSelection = (val: string) => {
    setSelected(val);
    onChange(val);
  };

  const selectedOption = sortOptions.find((e) => e.value === selected);
  const translation = useContext(TranslationContext);

  return h(
    Menu,
    {
      as: 'div',
      class:
        'ds-sdk-sort-dropdown relative inline-block text-left bg-gray-100 rounded-md outline outline-1 outline-gray-200 hover:outline-gray-600 h-[32px] z-10',
    },
    h(
      Menu.Button,
      {
        class:
          'group flex justify-center items-center font-normal text-sm text-gray-700 rounded-md hover:cursor-pointer border-none bg-transparent hover:border-none hover:bg-transparent focus:border-none focus:bg-transparent active:border-none active:bg-transparent active:shadow-none h-full w-full px-sm',
        onClick: () => setIsOpen(!isOpen),
      },
      h(
        Fragment,
        null,
        h(SortIcon, { class: 'h-md w-md mr-sm stroke-gray-600' }),
        selectedOption
          ? `${translation.SortDropdown.title}: ${selectedOption.label}`
          : translation.SortDropdown.title,
        isOpen
          ? h(Chevron, {
              class:
                'flex-shrink-0 m-auto ml-sm h-md w-md stroke-1 stroke-gray-600 rotate-180',
            })
          : h(Chevron, {
              class:
                'flex-shrink-0 m-auto ml-sm h-md w-md stroke-1 stroke-gray-600',
            })
      )
    ),
    h(
      Transition,
      {
        enter: 'transition ease-out duration-100',
        enterFrom: 'transform opacity-0 scale-95',
        enterTo: 'transform opacity-100 scale-100',
        leave: 'transition ease-in duration-75',
        leaveFrom: 'transform opacity-100 scale-100',
        leaveTo: 'transform opacity-0 scale-95',
      },
      h(
        Menu.Items,
        {
          static: true,
          class:
            'ds-sdk-sort-dropdown__items origin-top-right absolute hover:cursor-pointer right-0 w-full rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none mt-2 z-20',
        },
        h(
          'div',
          { class: 'py-xs' },
          sortOptions.map((option) =>
            h(
              Menu.Item,
              { key: option.value },
              ({ active }: { active: boolean }) =>
                h(
                  'a',
                  {
                    class: `ds-sdk-sort-dropdown__items--item block-display px-md py-sm text-sm mb-0
                                                    no-underline active:no-underline focus:no-underline hover:no-underline
                                                    hover:text-gray-800 ${
                                                      option.value === selected
                                                        ? 'ds-sdk-sort-dropdown__items--item-selected font-semibold text-gray-900'
                                                        : 'font-normal text-gray-800'
                                                    } ${
                      active
                        ? 'ds-sdk-sort-dropdown__items--item-active bg-gray-100 text-gray-900'
                        : ''
                    }`,
                    onClick: () => handleSelection(option.value),
                  },
                  option.label
                )
            )
          )
        )
      )
    )
  );
};
