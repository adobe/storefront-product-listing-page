import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';

export interface SwatchButtonProps {
  key: string;
  value: string;
  type: string;
  checked: boolean;
  onClick: (e: any) => any;
}
export const SwatchButton: FunctionComponent<SwatchButtonProps> = ({
  key,
  value,
  type,
  checked,
  onClick,
}: // onClick,
SwatchButtonProps) => {
  const outlineColor = checked ? 'outline-gray-800' : 'outline-gray-200';
  const [selected, setSelected] = useState(checked);
  // const handleSelection = (val: boolean) => {
  //     setSelected(val);
  //     onClick(val);
  // };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const onC = onClick

  if (type === 'COLOR_HEX') {
    // eslint-disable-next-line no-console
    console.log('here', key);
    const color = value.toLowerCase();
    const className = `min-w-[32px] ring-black ring-opacity-5 rounded-full p-sm outline ${outlineColor} h-[32px]`;
    return (
      <div className="ds-sdk-swatch-button">
        <button
          key={key}
          className={className}
          style={`background-color: ${color}`}
          // onClick={() => handleSelection(!selected)}
          // checked={!checked}
          // onClick={() => setSelected(!selected)}
          // checked={selected}
          onClick={onClick}
          checked={!checked}
        />
      </div>
    );
  }

  if (type === 'image_url') {
    // const color = value.toLowerCase();
    const className = `min-w-[32px] bg-gray-100 ring-black ring-opacity-5 rounded-full p-sm outline ${outlineColor} h-[32px]`;
    return (
      <div className="ds-sdk-swatch-button">
        <button
          key={key}
          className={className}
          style={`background-image: url(${value}})`}
          onClick={() => setSelected(!selected)}
          checked={selected}
        />
      </div>
    );
  }
  const className = `flex items-center bg-gray-100 ring-black ring-opacity-5 rounded-full p-sm  outline ${outlineColor} h-[32px]`;
  return (
    <div className="ds-sdk-swatch-button">
      <button
        key={key}
        className={className}
        onClick={() => setSelected(!selected)}
        checked={selected}
      >
        {value}
      </button>
    </div>
  );
};
