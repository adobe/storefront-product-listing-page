/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import useScalarFacet from 'src/hooks/useScalarFacet';

import {
  useStore,
  useTranslation,
} from '../../context';
import SortFilterIcon from "../../icons/sortfilter.svg";
import { Facet as FacetType } from '../../types/interface';
import FilterSelectionGroup from '../FilterSelection';
import { ScalarFacet } from './Scalar/ScalarFacet';
import { SelectedFilters } from './SelectedFilters';

interface FacetsProps {
  searchFacets: FacetType[];
  totalCount?: number;
  displayFilter?: () => void;
}

const sizeFacetsOrder = [
  'A', 'AB', 'B', 'C', 'CD', 'D', 'DD', 'E', 'EF', 'F', 'GH', 'IJ',
  'NO SIZE', 'NB8', 'NS', 'ONE SIZE',
  'PPET', 'PTSM', 'PML', 'Q', 'Q+', 'QT',
  'XS', 'X SMALL/SMALL', 'XS SHORT',
  'S', 'SMALL TALL', 'S/5', 'S SHORT', 'SSHORT', 'S/D-DD', 'S/M', 'ST',
  'M', 'M/6', 'M SHORT', 'MSHORT', 'M PLUS', 'MEDIUM TALL', 'M/T', 'MT', 'M/D-DD', 'M/DD', 'M/L', 'M-L',
  'L', 'L/7', 'L SHORT', 'LT', 'TL', 'T', 'L PLUS', 'L-X', 'Large-Extra', 'L/D-DD', 'L/DD', 'L/XL',
  'XL', 'XL/8', 'XL PLUS', 'XL/D-DD', 'XL/1X', 'XL/2X', 'XL SHORT', 'XLT',
  '0-3', '0M-6M', '0M-6M', '0M-6M', '0-6M',
  '1', '1X', '1PLUS', '1-2', '1/2X', '1X-3X', '1.5', '1X/2X', '1XT/2XT',
  '2', '2-4', '2.5', '2T', '2X', '2XB', '2XL', 'XXL', 'XXLP', 'XXL/9', '2XL SHORT', '2XT', '2XLT', '2PLUS', '2XL PLUS', '2/3', '2X/3X', '2/3T',
  '3', '3-6', '3P', '3MTH', '3T', '3.5', '3XL', 'XXXL/10', '3XB', '3XT', '3XT/4XT', '3X', '3PLUS', '3/4X', '3X/4X',
  '4T', '4', '4.5', '4X', '4XB', '4XL', '4XL TAL', '4XT', '4/5', '4-5P', '4/5T', '4X-6X', '4X-7X',
  '5', '5X', '5XL', '5XT', '5.5', '5/6', '5-6 1/2', '5/6X', '5X/6X', '5-7', '5-9',
  '6', '6MTH', '6/6X', '6X', '6XL', '6XLT', '6PLUS', '6.5', '6/7', '6-7 1/2', '6-9', '6-9 MONTHS', '6-10', '6-12', '6-12M',
  '7', '7XL', '7.5', '7-8', '7/8', '7-8 1/2', '7-9', '7 1/2-9',
  '8', '8XL', '8.5', '8/9', '8-10', '8-12',
  '9', '9MTH', '9XL', '9X', '9.5', '9-10', '9-11', '9-11_1', '9-12', '09/12/19',
  '10', '10X', '10XL', '10.5', '10/11', '10-12', '10/12', '10-13', '10/13/19', '10-14', '10-15',
  '11', '11.5', '11-12', '11-13',
  '12', '12MTH', '12.5', '12/13', '12-14', '12/14', '12/14/19', '12-18M', '12-24', '12-24M',
  '13', '13-1', '13.5', '14', '14W', '14/16', '15', '16', '16W', '16-18', '18', '18W', '18MTH', '18M-24M',
  '20', '20W', '22', '22W', '24', '24W', '24MTH', '26', '26W', '28', '28W',
  '30', '30W', '32', '34', '34A', '36', '38', '40', '42', '50',
  'YS', 'YM', 'YL', 'YXL',
  'IPHONE 11', 'IPHONE11PM', 'IPhone11PR', 'IPHONE 12', 'IPHONE12MI', 'IPHONE12PM',
];

export const scrollFilter = (
  event: any,
  displayFunction: (() => void) | undefined,
) => {
  const activateEvent = event.type === 'click' || (event.type === 'keydown' && event.key === 'Enter') || false;

  if (!activateEvent) {
    return;
  }

  displayFunction?.();

  const clicked = event.target;
  const filterNumber = Number(clicked.id.split('-')[1])
  const targetNode = document.querySelector('.mobile-filters-container');
  const config = {attributes: false, childList: true, subtree: true};

  const wait = async (time:number) => {
    return new Promise(resolve => {
      setTimeout(resolve, time);
    });
  }
  const callback = async (mutationList:MutationRecord[]) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        await wait(300);
        const filterInput = document.querySelectorAll('.mobile-filters-container form .ds-sdk-input');
        const filterToShow = filterInput[filterNumber] || null;
        const filterToHide = document.querySelectorAll('.mobile-filters-container form .ds-sdk-input fieldset:not(.none-display)');

        if (filterToShow !== null) {
          filterToHide?.forEach(element => {
            element.closest('.ds-sdk-input')?.contains(clicked.querySelector('input'))
            element.closest('.ds-sdk-input')?.classList.remove('active')
            element.classList.add('none-display')
            element.nextElementSibling?.classList.remove('mt-md')
          })

          if ("classList" in filterToShow) {
            filterToShow.classList.add('active');
          }

          if ("querySelector" in filterToShow) {
            filterToShow.querySelector('fieldset')?.classList.remove('none-display');
            filterToShow.querySelector('.ds-sdk-input__border')?.classList.add('mt-md');
          }
        }
        observer.disconnect()
        break;
      }
    }
  };

  const observer = new MutationObserver(callback);

  if (targetNode) {
    observer.observe(targetNode, config);
  }
}

export const Facets: FunctionComponent<FacetsProps> = ({
  searchFacets,
  totalCount,
  displayFilter,
}: FacetsProps) => {
  const {config} = useStore();
  const translation = useTranslation();

  searchFacets = searchFacets.filter(facet => facet.buckets.length > 0);

  const searchFacetsSliced = searchFacets?.slice(0, 3)
  const [selectedFacet] = useState<FacetType | null>(null);
  const isCategory = config?.currentCategoryUrlPath || config?.currentCategoryId;

  const {isSelected, onChange} = useScalarFacet(selectedFacet);

  const onFacetChange = (value: string, selected?: boolean, type?: string) => {
    if (type?.includes('link')) {
      if (config?.onCategoryChange) {
        config.onCategoryChange(value);
        return;
      }
    }
    onChange(value, selected);
  }

  return (
    <div className="ds-plp-facets flex flex-col">
      <div className="border-t border-b border-neutral-450">
        <div className={'flex flex-row items-center px-[12px] md:px-[24px] lg:px-[48px] mx-auto w-full'}>
          <div className="flex justify-between">
            <form className="ds-plp-facets__list flex gap-x-3.2rem">
              <div class="ds-sdk-input py-md">
                <div class="flex items-center gap-x-1 cursor-pointer"
                     tabindex={0}
                     onClick={(event) => scrollFilter(event, displayFilter)}
                     onKeyDown={(event) => scrollFilter(event, displayFilter)}
                     >
                  <label id={'filter-0'}
                         className="flex flex-row gap-4 ds-sdk-input__label text-neutral-900 text-sm font-semibold cursor-pointer">
                    <SortFilterIcon className="h-[18px] w-[18px] fill-neutral-800"/>
                    {translation.Filter.title}
                  </label>
                </div>
              </div>
              {searchFacetsSliced?.map((facet, index) => {
                const bucketType = facet?.buckets[0]?.__typename;
                if (facet?.attribute === 'pim_sku_size_filter') {
                    facet?.buckets.sort((a, b) => {
                      const indexA = sizeFacetsOrder.indexOf(a.title);
                      const indexB = sizeFacetsOrder.indexOf(b.title);

                      if (indexA !== -1 && indexB !== -1) {
                        return indexA - indexB;
                      }

                      if (indexA !== -1) {
                        return -1;
                      }

                      if (indexB !== -1) {
                        return 1;
                      }

                      return a.title.localeCompare(b.title);
                    });
                }
                switch (bucketType) {
                  case 'ScalarBucket':
                    return (
                      <ScalarFacet
                        key={facet.attribute}
                        filterData={facet}
                        iteration={index}
                        displayFilter={displayFilter}
                      />
                    );
                  case 'RangeBucket':
                    return(
                      <ScalarFacet
                        key={facet.attribute}
                        filterData={facet}
                        iteration={index}
                        displayFilter={displayFilter}
                      />
                    );
                  case 'CategoryView':
                    return (
                      <ScalarFacet
                        key={facet.attribute}
                        filterData={facet}
                        iteration={index}
                        displayFilter={displayFilter}
                      />
                    );
                  default:
                    return null;
                }
              })}
            </form>
          </div>
          <div className="ml-auto filters-count">
            <SelectedFilters totalCount={totalCount} isCount={true}/>
          </div>
        </div>
        <div className="px-[12px] md:px-[24px] lg:px-[48px] w-full filters-facets">
          {selectedFacet && (
            <FilterSelectionGroup
              title={selectedFacet.title}
              attribute={selectedFacet.attribute}
              buckets={selectedFacet.buckets as any}
              isSelected={isSelected}
              onChange={(args) => onFacetChange(args.value, args.selected, args.type)}
              type={isCategory && selectedFacet?.buckets[0]?.__typename === 'CategoryView' ? 'link' : 'checkbox'}
            />
          )}
        </div>
      </div>
      <SelectedFilters totalCount={totalCount} isCount={false}/>
    </div>
  );
};
