/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useStore } from '../../context';
import { Facet as FacetType, PriceFacet } from '../../types/interface';
import SliderDoubleControl from '../SliderDoubleControl';
import { RangeFacet } from './Range/RangeFacet';
import { ScalarFacet } from './Scalar/ScalarFacet';

interface FacetsProps {
  searchFacets: FacetType[];
}

export const MobileFacets: FunctionComponent<FacetsProps> = ({
  searchFacets,
}: FacetsProps) => {
  const {
    config: { priceSlider },
  } = useStore();

  return (
    <div className="ds-plp-facets flex flex-col">
      <h1>Filter Products</h1>
      <form className="ds-plp-facets__list border-t border-neutral-500">
        {searchFacets?.map((facet) => {
          const bucketType = facet?.buckets[0]?.__typename;
          switch (bucketType) {
            case 'ScalarBucket':
              return <ScalarFacet key={facet.attribute} filterData={facet} />;
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
              return <ScalarFacet key={facet.attribute} filterData={facet} />;
            default:
              return null;
          }
        })}
      </form>
    </div>
  );
};
