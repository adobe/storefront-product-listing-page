/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import CartIcon from '../../icons/cart.svg';

export interface AddToCartButtonProps {
  onClick: (e: any) => any;
}
export const AddToCartButton: FunctionComponent<AddToCartButtonProps> = ({
  onClick,
}: AddToCartButtonProps) => {
  return (
    <div className="ds-sdk-add-to-cart-button">
      <button
        className="flex items-center justify-center text-white font-button-2 bg-brand-500 rounded-full h-[32px] w-full p-sm"
        onClick={onClick}
      >
        <CartIcon className="w-[24px] pr-4 stroke-2" />
        Add To Cart
      </button>
    </div>
  );
};
