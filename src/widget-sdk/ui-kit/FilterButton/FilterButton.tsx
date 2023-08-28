import { FunctionComponent } from 'preact';
import { useContext } from 'preact/hooks';

import { TranslationContext } from '../../../context/translation';
import AdjustmentsIcon from '../../icons/adjustments.svg';

export interface FilterButtonProps {
  displayFilter: () => void;
}
export const FilterButton: FunctionComponent<FilterButtonProps> = ({
  displayFilter,
}: FilterButtonProps) => {
  const translation = useContext(TranslationContext);
  return (
    <div className="ds-sdk-filter-button">
      <button
        className="flex items-center bg-gray-100 ring-black ring-opacity-5 rounded-md p-sm  outline outline-gray-200 hover:outline-gray-800 h-[32px]"
        onClick={displayFilter}
      >
        <AdjustmentsIcon className="w-md" />
        {translation.Filter.title}
      </button>
    </div>
  );
};
