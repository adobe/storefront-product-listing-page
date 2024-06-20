/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';
import { useState } from 'react';
import useScalarFacet from 'src/hooks/useScalarFacet';

import { useStore } from '../../context';
import { Facet as FacetType, PriceFacet } from '../../types/interface';
import FilterSelectionGroup from '../FilterSelection';
import SliderDoubleControl from '../SliderDoubleControl';
import { RangeFacet } from './Range/RangeFacet';
import { ScalarFacet } from './Scalar/ScalarFacet';
import { SelectedFilters } from './SelectedFilters';

interface FacetsProps {
  searchFacets: FacetType[];
}

export const Facets: FunctionComponent<FacetsProps> = ({
  searchFacets,
}: FacetsProps) => {
  const {
    config: { priceSlider },
  } = useStore();

  const [selectedFacet, setSelectedFacet] = useState<FacetType | null>(null);

  const handleTesting = (facet: FacetType) => {
    setSelectedFacet((prevFacet) => {
      if (!prevFacet || prevFacet.title !== facet.title) {
        return facet;
      }
      return null;
    });
  };

  const { isSelected, onChange } = useScalarFacet(selectedFacet);

  return (
    <div className="ds-plp-facets flex flex-col">
      <form className="ds-plp-facets__list border-t border-b border-neutral-500 flex gap-x-6">
        {searchFacets?.map((facet) => {
          const bucketType = facet?.buckets[0]?.__typename;
          switch (bucketType) {
            case 'ScalarBucket':
              return (
                <ScalarFacet
                  key={facet.attribute}
                  filterData={facet}
                  handleFilter={() => handleTesting(facet)}
                />
              );
            case 'RangeBucket':
              return priceSlider ? (
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
                />
              );
            default:
              return null;
          }
        })}
      </form>
      {selectedFacet && (
        <div>
          <FilterSelectionGroup
            title={selectedFacet.title}
            attribute={selectedFacet.attribute}
            buckets={selectedFacet.buckets as any}
            isSelected={isSelected}
            onChange={(args) => onChange(args.value, args.selected)}
            type={'checkbox'}
          />
        </div>
      )}
      <SelectedFilters />
    </div>
  );
};
