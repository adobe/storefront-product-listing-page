/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useStore } from '../../context';
import {Facet as FacetType, PriceFacet, SortOption} from '../../types/interface';
import SliderDoubleControl from '../SliderDoubleControl';
import { RangeFacet } from './Range/RangeFacet';
import { ScalarFacet } from './Scalar/ScalarFacet';
import CloseIcon from "../../icons/plus.svg";
import {SortDropdown} from "../SortDropdown";

interface FacetsProps {
  searchFacets: FacetType[];
  onClose: () => void;
  value: string;
  sortOptions: SortOption[];
  onChange: (sortBy: string) => void;
}

export const MobileFacets: FunctionComponent<FacetsProps> = ({
  searchFacets,
  onClose,
  value,
  sortOptions,
  onChange
}: FacetsProps) => {
  const {
    config: { priceSlider },
  } = useStore();

  return (
    <div className="ds-plp-facets flex flex-col">
        <div className={'flex flex-row'}>
            <h1 className={'text-2xl mb-8'}>Sort & Filter</h1>
            <CloseIcon
                className="h-[28px] w-[28px] rotate-45 inline-block cursor-pointer fill-neutral-800 ml-auto"
                onClick={onClose}
            />
        </div>

        <form className="ds-plp-facets__list border-t border-neutral-500">
            <SortDropdown
              sortOptions={sortOptions}
              value={value}
              onChange={onChange}
              mobile
            />
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
