import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';

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
  const outlineColor = checked ? 'outline-gray-800' : 'outline-gray-200';
  if (type === 'COLOR_HEX') {
    // eslint-disable-next-line no-console
    console.log('swatch key', id);
    const color = value.toLowerCase();
    const className = `${id} min-w-[32px] ring-black ring-opacity-5 rounded-full p-sm outline ${outlineColor} h-[32px]`;
    return (
      <div className={`ds-sdk-swatch-button_${id}`}>
        <button
          key={id}
          className={className}
          style={`background-color: ${color}`}
          onClick={onClick}
          checked={checked}
        />
      </div>
    );
  }

  if (type === 'image_url') {
    const className = `${value} min-w-[32px] bg-gray-100 ring-black ring-opacity-5 rounded-full p-sm outline ${outlineColor} h-[32px]`;
    return (
      <div className={`ds-sdk-swatch-button_${value}`}>
        <button
          key={id}
          className={className}
          style={`background-image: url(${value}})`}
          onClick={onClick}
          checked={checked}
        />
      </div>
    );
  }
  const className = `${value} flex items-center bg-gray-100 ring-black ring-opacity-5 rounded-full p-sm  outline ${outlineColor} h-[32px]`;
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
