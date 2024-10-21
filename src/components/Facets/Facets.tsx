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

export const scrollFilter = (
  event: Omit<MouseEvent, "currentTarget"> & { readonly currentTarget: HTMLDivElement },
  displayFunction: (() => void) | undefined
) => {
  displayFunction?.();

  const clicked = event.currentTarget;
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
        const filterToShow = filterInput[filterNumber];
        const filterToHide = document.querySelectorAll('.mobile-filters-container form .ds-sdk-input fieldset:not(.none-display)');

        filterToHide?.forEach(element => {
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
  const searchFacetsSliced = searchFacets?.slice(0, 4)
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
                     onClick={(event) => scrollFilter(event, displayFilter)}>
                  <label id={'filter-0'}
                         className="flex flex-row gap-4 ds-sdk-input__label text-neutral-900 text-sm font-semibold cursor-pointer">
                    <SortFilterIcon className="h-[18px] w-[18px] fill-neutral-800"/>
                    {translation.Filter.title}
                  </label>
                </div>
              </div>
              {searchFacetsSliced?.map((facet, index) => {
                const bucketType = facet?.buckets[0]?.__typename;
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
