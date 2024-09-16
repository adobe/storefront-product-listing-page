/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

export interface GoButtonProps {
  onClick: (e: any) => any;
}
export const GoButton: FunctionComponent<GoButtonProps> = ({
  onClick,
}: GoButtonProps) => {
  return (
      <div className="ds-sdk-go-button">
          <div
              class="w-full text-center text-white text-base font-normal
              font-['Futura Md BT'] bg-black hover:bg-[#904547]" onClick={onClick}>
              GO
          </div>
      </div>
  );
};
