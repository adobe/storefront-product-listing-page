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
  type: string;
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
  const outlineColor = checked ? 'border-black' : 'border-transparent';

  if (type === 'COLOR_HEX') {
    const color = value.toLowerCase();
    const className = `min-w-[32px] rounded-full p-sm border border-[1.5px] ${outlineColor} h-[32px]`;
    const isWhite = color === '#ffffff' || color === '#fff';
    return (
      <div className={`ds-sdk-swatch-button_${id}`}>
        <button
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

  if (type === 'image_url' && value) {
    const className = `${value} min-w-[32px] bg-gray-100 ring-black ring-opacity-5 rounded-full p-sm outline ${outlineColor} h-[32px]`;
    return (
      <div className={`ds-sdk-swatch-button_${value}`}>
        <button
          key={id}
          className={className}
          style={{ backgroundImage: `url(${value})` }}
          onClick={onClick}
          checked={checked}
        />
      </div>
    );
  }
  const className = `flex items-center bg-white ring-black ring-opacity-5 rounded-full p-sm h-[32px] border-transparent`;
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
