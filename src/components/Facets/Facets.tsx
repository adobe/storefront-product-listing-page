/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import useScalarFacet from 'src/hooks/useScalarFacet';
import { getValueFromUrl, handleUrlSort } from 'src/utils/handleUrlFilters';
import {
  defaultSortOptions,
  generateGQLSortInput,
  getSortOptionsfromMetadata,
} from 'src/utils/sort';

import {
  useAttributeMetadata,
  useSearch,
  useStore,
  useTranslation,
} from '../../context';
import { Facet as FacetType, PriceFacet } from '../../types/interface';
import FilterSelectionGroup from '../FilterSelection';
import { ScalarFacet } from './Scalar/ScalarFacet';
import { SelectedFilters } from './SelectedFilters';
import SortFilterIcon from "../../icons/sortfilter.svg";

interface FacetsProps {
  searchFacets: FacetType[];
  totalCount?: number;
  displayFilter: () => void;
}

export const Facets: FunctionComponent<FacetsProps> = ({
  searchFacets,
  totalCount,
  displayFilter,
}: FacetsProps) => {
  const { config } = useStore();
  const searchCtx = useSearch();
  const attributeMetadata = useAttributeMetadata();
  const translation = useTranslation();

  const attributesToFilter = [
    'featured',
    'new',
    'price',
  ];

  const searchFacetsSliced = searchFacets?.slice(0, 4)

  const filteredAttributes = attributeMetadata?.sortable.filter((item) =>
    attributesToFilter.includes(item.attribute)
  );

  const [selectedFacet, setSelectedFacet] = useState<FacetType | null>(null);
  const [sortOptions, setSortOptions] = useState(defaultSortOptions());

  const getSortOptions = useCallback(() => {
    setSortOptions(
      getSortOptionsfromMetadata(
        translation,
        filteredAttributes,
        config?.displayOutOfStock,
        config?.currentCategoryUrlPath,
        config?.currentCategoryId
      )
    );
  }, [config, translation, attributeMetadata]);

  useEffect(() => {
    getSortOptions();
  }, [getSortOptions]);

  const isCategory = config?.currentCategoryUrlPath || config?.currentCategoryId;
  const defaultSortOption =
    isCategory
      ? 'position_ASC'
      : 'relevance_DESC';
  const sortFromUrl = getValueFromUrl('product_list_order');
  const sortByDefault = sortFromUrl ? sortFromUrl : defaultSortOption;
  const [sortBy, setSortBy] = useState<string>(sortByDefault);
  const onSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    searchCtx.setSort(generateGQLSortInput(sortOption));
    handleUrlSort(sortOption);
  };
  const wait = async (time) => {
    return new Promise(resolve => {
      setTimeout(resolve, time);
    });
  }
  const handleTesting = async (facet: FacetType) => {
    document.querySelector('.ds-sdk-filterGroup')?.classList.remove('open');
    await wait(257);
    setSelectedFacet((prevFacet) => {
      if (!prevFacet || prevFacet.title !== facet.title) {
        return facet;
      }
      return null;
    });
  };

  const getSelectedFilters = (facet: FacetType) => {
    const { attribute } = facet;
    const categoryFiltered = searchCtx.filters.find(
      (item) => item.attribute === attribute
    );
    return categoryFiltered?.in?.length ?? 0;
  };

  const { isSelected, onChange } = useScalarFacet(selectedFacet);

  const onFacetChange = (value: string, selected?: boolean, type?: string) => {
    if (type?.includes('link')) {
      if (config?.onCategoryChange) {
        config.onCategoryChange(value);
        return;
      }
    }
    onChange(value, selected);
  }

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

  return (
    <div className="ds-plp-facets flex flex-col">
      <div className="border-t border-b border-neutral-450">
        <div className={'flex flex-row items-center px-[12px] md:px-[24px] lg:px-[48px] mx-auto w-full'}>
          <div className="flex justify-between">
            <form className="ds-plp-facets__list flex gap-x-3.2rem">
              <div class="ds-sdk-input py-md">
                <div class="flex items-center gap-x-1 cursor-pointer" onClick={scrollFilter}>
                  <label id={'filter-0'}
                         className="flex flex-row gap-4 ds-sdk-input__label text-neutral-900 font-headline-1 text-sm font-semibold cursor-pointer">
                    <SortFilterIcon className="h-[18px] w-[18px] fill-neutral-800" />
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
                            handleFilter={() => handleTesting(facet)}
                            selectedNumber={getSelectedFilters(facet)}
                            selectedFacet={selectedFacet}
                            displayFilter={displayFilter}
                        />
                    );
                  case 'RangeBucket':
                    <ScalarFacet
                        key={facet.attribute}
                        filterData={facet}
                        iteration={index}
                        handleFilter={() => handleTesting(facet)}
                        selectedNumber={getSelectedFilters(facet)}
                        selectedFacet={selectedFacet}
                        displayFilter={displayFilter}
                    />
                  case 'CategoryView':
                    return (
                        <ScalarFacet
                            key={facet.attribute}
                            filterData={facet}
                            iteration={index}
                            handleFilter={() => handleTesting(facet)}
                            selectedNumber={getSelectedFilters(facet)}
                            selectedFacet={selectedFacet}
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
