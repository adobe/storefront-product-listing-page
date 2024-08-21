/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useSensor, useTranslation } from '../../context';
import PlusIcon from '../../icons/plus.svg';

export interface AddToCartButtonProps {
  onClick: (e: any) => any;
}
export const AddToCartButton: FunctionComponent<AddToCartButtonProps> = ({
  onClick,
}: AddToCartButtonProps) => {
  const { screenSize } = useSensor();
  const translation = useTranslation();

  return (
    <div className="ds-sdk-add-to-cart-button h-[40px] w-[40px] lg:h-full lg:w-full">
      <button
        className="flex items-center justify-center h-full w-full gap-2 lg:px-big lg:py-[10px]"
        onClick={onClick}
      >
        <PlusIcon className="w-[14px]" />
        {screenSize.desktop && translation.ProductCard.quickAdd}
      </button>
    </div>
  );
};
