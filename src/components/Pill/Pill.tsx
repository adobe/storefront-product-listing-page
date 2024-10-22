/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { JSXInternal } from 'preact/src/jsx';

import CloseIcon from '../../icons/plus.svg';
export interface PillProps {
  label: string;
  onClick: () => void;
  CTA?: JSXInternal.Element;
  classes?: string;
  type?: string;
}

const defaultIcon = (
  <CloseIcon className="h-[12px] w-[12px] rotate-45 inline-block ml-1 cursor-pointer  fill-gray-700" />
);

// TODO: add support later to pass classes to the container div
export const Pill: FunctionComponent<PillProps> = ({
  label,
  onClick,
  CTA = defaultIcon,
  type,
}) => {
  return type === 'transparent' ? (
    <div
      key={label}
      className="text-left ml-[0.25rem] p-[0.27rem] py-[0.5rem] pr-[0.5rem] first:ml-0 hover:bg-[#904547] hover:text-white hover:opacity-100 bg-white border border-black rounded-[15px] opacity-50 text-black text-base font-normal font-['FuturaBT-Medium'] whitespace-nowrap"
    >
      <span className="ds-sdk-pill__label font-normal">{label}</span>
      <span className="ds-sdk-pill__cta" onClick={onClick}>
        {CTA}
      </span>
    </div>
  ) : (
    <div
      key={label}
      className="ds-sdk-pill inline-flex justify-content items-center bg-gray-100 rounded-full w-fit outline outline-gray-200 min-h-[32px] px-4 py-1"
    >
      <span className="ds-sdk-pill__label font-normal text-sm">{label}</span>
      <span className="ds-sdk-pill__cta" onClick={onClick}>
        {CTA}
      </span>
    </div>
  );
};
