import { FunctionComponent } from 'preact';

import TooltipIcon from '../../icons/info.svg';

export const TextWithTooltip: FunctionComponent<{
  text: string;
  tooltipText: string;
}> = ({ text, tooltipText }) => {
  return (
    <div class="group">
      <label className="ds-sdk-input__label text-base font-normal text-neutral-900">
        {text}
      </label>
      <button>
        <TooltipIcon className="ds-sdk-input__info h-[15px] w-[15px] inline-block ml-sm cursor-pointer fill-brand-300" />
      </button>
      <span class="group-hover:opacity-100 min-w-[32px] transition-opacity bg-neutral-400 px-1 text-sm text-neutral-900 rounded-2 opacity-0 m-4">
        {tooltipText}
      </span>
    </div>
  );
};
