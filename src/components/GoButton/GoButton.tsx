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
      <div className="ds-sdk-go-button relative w-full bottom-[0] left-[0]">
          <div
              class="w-full text-center text-white text-base font-normal
              font-['Futura Md BT'] bg-black hover:no-underline hover:bg-[#f55d66] hover:border-t-[solid_1px_#f55d66]" onClick={onClick}>
              GO
          </div>
      </div>
  );
};
