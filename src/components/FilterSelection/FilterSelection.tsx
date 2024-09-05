import { FunctionComponent } from 'preact';

import MinusIcon from '../../icons/minus.svg';
import PlusIcon from '../../icons/plus.svg';
import { Facet as FacetType, PriceFacet } from '../../types/interface';

export type FilterSelectionTitleSlot = (label: string) => FunctionComponent;

export interface FilterSelectionProps {
  title: string;
  attribute?: string;
  filterSelectionTitleSlot?: FilterSelectionTitleSlot;
  handleFilter?: () => void;
  displayFilter?: () => void;
  selectedNumber?: number;
  selectedFacet?: FacetType | PriceFacet | null;
  iteration: number;
}

export const FilterSelection: FunctionComponent<FilterSelectionProps> = ({
  title,
  filterSelectionTitleSlot,
  handleFilter,
  displayFilter,
  selectedNumber,
  selectedFacet,
  iteration,
}) => {
  const handleOptions = () => {
    handleFilter?.();

    const targetNode = document.querySelector('.filters-facets');
    const config = { attributes: false, childList: true, subtree: true };
    const wait = async (time) => {
      return new Promise(resolve => {
        setTimeout(resolve, time);
      });
    }
    const callback = async (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0 && !document.querySelector('.ds-sdk-filterGroup')?.classList.contains('open')) {
          await wait(5);
          document.querySelector('.ds-sdk-filterGroup')?.classList.add('open');
          break;
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  };

  const scrollFilter = (event) => {
    displayFilter?.();

    const clicked = event.target;
    const filterNumber = Number(clicked.id.split('-')[1])
    const targetNode = document.querySelector('.mobile-filters-container');
    const config = { attributes: false, childList: true, subtree: true };

    const wait = async (time) => {
      return new Promise(resolve => {
        setTimeout(resolve, time);
      });
    }
    const callback = async (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          await wait(300);
          const filterToShow = document.querySelectorAll('.mobile-filters-container form .ds-sdk-input')[filterNumber]
          const filterToHide = document.querySelectorAll('.mobile-filters-container form .ds-sdk-input fieldset:not(.none-display)')

          filterToHide.forEach(element => {
            element.closest('.ds-sdk-input')?.classList.remove('active')
            element.classList.add('none-display')
            element.nextElementSibling?.classList.remove('mt-md')
          })

          filterToShow.classList.add('active');
          filterToShow.querySelector('fieldset')?.classList.remove('none-display');
          filterToShow.querySelector('.ds-sdk-input__border')?.classList.add('mt-md');
          break;
        }
      }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }

  const isSelected = title === selectedFacet?.title;
  return (
    <div className="ds-sdk-input py-md">
      {filterSelectionTitleSlot ? (
        filterSelectionTitleSlot(title)
      ) : (
        <div
          className="flex items-center gap-x-1 cursor-pointer"
          onClick={scrollFilter}
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
