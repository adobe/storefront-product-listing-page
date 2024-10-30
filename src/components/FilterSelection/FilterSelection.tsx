import { FunctionComponent } from 'preact';

import { scrollFilter } from "../Facets";

export type FilterSelectionTitleSlot = (label: string) => FunctionComponent;

export interface FilterSelectionProps {
  title: string;
  attribute?: string;
  filterSelectionTitleSlot?: FilterSelectionTitleSlot;
  displayFilter?: () => void;
  iteration: number;
}

export const FilterSelection: FunctionComponent<FilterSelectionProps> = ({
  title,
  filterSelectionTitleSlot,
  displayFilter,
  iteration,
}) => {
  return (
    <div className="ds-sdk-input py-md">
      {filterSelectionTitleSlot ? (
        filterSelectionTitleSlot(title)
      ) : (
        <div
          className="flex items-center gap-x-1 cursor-pointer"
          onClick={(event) => scrollFilter(event, displayFilter, true)}
        >
          <label
            id={`filter-${iteration + 1}`}
            className="ds-sdk-input__label text-neutral-900 text-sm font-semibold cursor-pointer"
          >
            {title}
          </label>
        </div>
      )}
    </div>
  );
};
