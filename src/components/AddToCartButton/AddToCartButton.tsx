/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import PlusIcon from '../../icons/plus.svg';
import { useSensor } from '../../context';

export interface AddToCartButtonProps {
  onClick: (e: any) => any;
}
export const AddToCartButton: FunctionComponent<AddToCartButtonProps> = ({
  onClick,
}: AddToCartButtonProps) => {
  const { screenSize } = useSensor();

  return (
    <div className={`ds-sdk-add-to-cart-button ${screenSize.desktop ? 'h-[100%] w-full' : 'h-[40px] w-[40px]'}`}>
      <button
        className={`flex items-center justify-center h-[100%] w-full gap-2 ${screenSize.desktop ? 'px-big py-[10px]': ''}`}
        onClick={onClick}
      >
        <PlusIcon className="w-[14px]" />
        {screenSize.desktop && 'Quick Add'}
      </button>
    </div>
  );
};
