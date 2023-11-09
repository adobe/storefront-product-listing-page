/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { Facet as FacetType, PriceFacet } from '../../types/interface';
import Slider from '../Slider';
import { ScalarFacet } from './Scalar/ScalarFacet';

interface FacetsProps {
  searchFacets: FacetType[];
}

export const Facets: FunctionComponent<FacetsProps> = ({
  searchFacets,
}: FacetsProps) => {
  return (
    <div className="ds-plp-facets flex flex-col">
      <form className="ds-plp-facets__list border-t border-gray-200">
        {searchFacets?.map((facet) => {
          const bucketType = facet?.buckets[0]?.__typename;
          switch (bucketType) {
            case 'ScalarBucket':
              return <ScalarFacet key={facet.attribute} filterData={facet} />;
            case 'RangeBucket':
              return <Slider filterData={facet as PriceFacet} />;
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
