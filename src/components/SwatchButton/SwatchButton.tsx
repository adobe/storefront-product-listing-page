/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

export interface SwatchButtonProps {
  id: string;
  value: string;
  type: 'COLOR_HEX' | 'IMAGE' | 'TEXT';
  checked: boolean;
  onClick: (e: any) => any;
}
export const SwatchButton: FunctionComponent<SwatchButtonProps> = ({
  id,
  value,
  type,
  checked,
  onClick,
}: SwatchButtonProps) => {
  const outlineColor = checked
    ? 'border-black'
    : type === 'COLOR_HEX'
    ? 'border-transparent'
    : 'border-gray';

  if (type === 'TEXT') {
    // const color = `swatch-color-${value.toLowerCase().replaceAll(' ', '-')}`; // tokenize the text value
    const color = value.toLowerCase();
    const mockColor = value.split(' ')[0].toLowerCase();
    const className = `min-w-[44px] p-sm border border-[1.5px] ${outlineColor} h-[44px] outline-transparent`;
    const isWhite = color === '#ffffff' || color === '#fff';
    return (
      <div className={`ds-sdk-swatch-button_${id}`}>
        <button
          title={value}
          key={id}
          className={className}
          style={{
            backgroundColor: id === 'show-more' ? null : mockColor,
            border: !checked && isWhite ? '1px solid #ccc' : undefined,
          }}
          onClick={onClick}
          checked={checked}
        >{id === 'show-more' ? '+' : ''}</button>
      </div>
    );
  }
  
  if (type === 'COLOR_HEX') {
    const color = value.toLowerCase();
    const className = `min-w-[32px] rounded-full p-sm border border-[1.5px] ${outlineColor} h-[32px] outline-transparent`;
    const isWhite = color === '#ffffff' || color === '#fff';
    return (
      <div className={`ds-sdk-swatch-button_${id}`}>
        <button
          title={value}
          key={id}
          className={className}
          style={{
            backgroundColor: color,
            border: !checked && isWhite ? '1px solid #ccc' : undefined,
          }}
          onClick={onClick}
          checked={checked}
        />
      </div>
    );
  }

  if (type === 'IMAGE' && value) {
    const className = `object-cover object-center min-w-[32px] rounded-full p-sm border border-[1.5px] ${outlineColor} h-[32px] outline-transparent`;
    const style = `background: url(${value}) no-repeat center; background-size: initial`;
    return (
      <div className={`ds-sdk-swatch-button_${value}`}>
        <button
          key={id}
          className={className}
          style={style}
          onClick={onClick}
          checked={checked}
        />
      </div>
    );
  }

  // assume TEXT type
  const className = `flex items-center bg-white rounded-full p-sm border border-[1.5px]h-[32px] ${outlineColor} outline-transparent`;
  return (
    <div className={`ds-sdk-swatch-button_${value}`}>
      <button
        key={id}
        className={className}
        onClick={onClick}
        checked={checked}
      >
        {value}
      </button>
    </div>
  );
};
