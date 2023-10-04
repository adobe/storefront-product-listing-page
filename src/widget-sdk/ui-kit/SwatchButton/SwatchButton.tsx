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
  const outlineColor = checked ? 'outline-black' : 'outline-transparent';
  if (type === 'COLOR_HEX') {
    const color = value.toLowerCase();
    const className = `min-w-[32px] rounded-full p-sm outline ${outlineColor} h-[32px]`;
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

  if (type === 'image_url' && value) {
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
