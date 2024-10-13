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
  <CloseIcon
    className="h-[20px] w-[20px] rotate-45 inline-block ml-sm cursor-pointer relative top-[-3px] fill-neutral-800"/>
);

// TODO: add support later to pass classes to the container div
export const Pill: FunctionComponent<PillProps> = ({
  label,
  onClick,
  CTA = defaultIcon,
  type,
}) => {
  const typeStyles: { [key in NonNullable<PillProps['type']>]: string } = {
    transparent: 'rounded-full px-4 py-1',
    filter: 'border border-neutral-450 px-2 py-1',
  };

  const baseStyles =
    'ds-sdk-pill inline-flex justify-content items-center w-fit min-h-[32px] px-4 py-2';

  const typeClass = type
    ? typeStyles[type]
    : 'rounded-full outline outline-gray-200 px-4 py-1';

  return (
    <div key={label} className={`${baseStyles} ${typeClass}`}>
      <span className="ds-sdk-pill__label font-normal text-sm">{label}</span>
      <span className="ds-sdk-pill__cta" onClick={onClick}>
        {CTA}
      </span>
    </div>
  );
};
