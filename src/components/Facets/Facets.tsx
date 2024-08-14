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
import SliderDoubleControl from '../SliderDoubleControl';
import SortDropdown from '../SortDropdown';
import { RangeFacet } from './Range/RangeFacet';
import { ScalarFacet } from './Scalar/ScalarFacet';
import { SelectedFilters } from './SelectedFilters';

import '../Facets/Facets.css';

interface FacetsProps {
  searchFacets: FacetType[];
  totalCount?: number;
}

export const Facets: FunctionComponent<FacetsProps> = ({
  searchFacets,
  totalCount,
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

  const handleTesting = (facet: FacetType) => {
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

  return (
    <div className="ds-plp-facets flex flex-col">
      <div className="border-t border-b border-neutral-500">
        <div className="ds-plp-facets__center-container flex justify-between items-center">
          <form className="ds-plp-facets__list flex gap-x-6">
            {searchFacets?.map((facet) => {
              const bucketType = facet?.buckets[0]?.__typename;
              switch (bucketType) {
                case 'ScalarBucket':
                  return (
                    <ScalarFacet
                      key={facet.attribute}
                      filterData={facet}
                      handleFilter={() => handleTesting(facet)}
                      selectedNumber={getSelectedFilters(facet)}
                      selectedFacet={selectedFacet}
                    />
                  );
                case 'RangeBucket':
                  return config?.priceSlider ? (
                    <SliderDoubleControl filterData={facet as PriceFacet} />
                  ) : (
                    <RangeFacet
                      key={facet.attribute}
                      filterData={facet as PriceFacet}
                    />
                  );
                case 'CategoryView':
                  return (
                    <ScalarFacet
                      key={facet.attribute}
                      filterData={facet}
                      handleFilter={() => handleTesting(facet)}
                      selectedNumber={getSelectedFilters(facet)}
                      selectedFacet={selectedFacet}
                    />
                  );
                default:
                  return null;
              }
            })}
          </form>
          <SortDropdown
            sortOptions={sortOptions}
            value={sortBy}
            onChange={onSortChange}
          />
        </div>
      </div>
      <div className="ds-plp-facets__center-container">
      {selectedFacet && (
        <FilterSelectionGroup
          title={selectedFacet.title}
          attribute={selectedFacet.attribute}
          buckets={selectedFacet.buckets as any}
          isSelected={isSelected}
          onChange={(args) => onFacetChange(args.value, args.selected, args.type)}
          type={isCategory && selectedFacet?.buckets[0]?.__typename  === 'CategoryView' ? 'link' : 'checkbox'}
        />
      )}
      <SelectedFilters totalCount={totalCount} />
      </div>
    </div>
  );
};
