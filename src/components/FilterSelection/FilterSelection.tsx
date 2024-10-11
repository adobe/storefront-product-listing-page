import { FunctionComponent } from 'preact';
import { scrollFilter } from "../Facets";

export type FilterSelectionTitleSlot = (label: string) => FunctionComponent;

export interface FilterSelectionProps {
  title: string;
  attribute?: string;
  filterSelectionTitleSlot?: FilterSelectionTitleSlot;
  displayFilter?: () => void;
  selectedNumber?: number;
  iteration: number;
}

export const FilterSelection: FunctionComponent<FilterSelectionProps> = ({
  title,
  filterSelectionTitleSlot,
  displayFilter,
  selectedNumber,
  iteration,
}) => {
  return (
    <div className="ds-sdk-input py-md">
      {filterSelectionTitleSlot ? (
        filterSelectionTitleSlot(title)
      ) : (
        <div
          className="flex items-center gap-x-1 cursor-pointer"
          onClick={(event) => scrollFilter(event, displayFilter)}
        >
          <label
              id={`filter-${iteration+1}`}
              className="ds-sdk-input__label text-neutral-900 font-headline-1 text-sm font-semibold cursor-pointer"
          >
            {title}{' '}
            {!!selectedNumber && (
              <span className="font-normal text-neutral-700">{`(${selectedNumber})`}</span>
            )}
          </label>
        </div>
      )}
    </div>
  );
};
