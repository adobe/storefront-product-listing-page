/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useProducts, useSearch } from '../../context';
import {
  Facet as FacetType,
  FacetFilter,
  PriceFacet,
} from '../../types/interface';
import { Pill } from '../Pill';
import { RangeFacet } from './Range/RangeFacet';
import { ScalarFacet } from './Scalar/ScalarFacet';

interface FacetsProps {
  searchFacets: FacetType[];
}

export const Facets: FunctionComponent<FacetsProps> = ({
  searchFacets,
}: FacetsProps) => {
  const searchCtx = useSearch();
  const productsCtx = useProducts();

  // format range with null "to"
  const formatRangeLabel = (filter: FacetFilter) => {
    const range = filter.range;

    const currencyRate = productsCtx.currencyRate
      ? productsCtx.currencyRate
      : '1';
    const currencySymbol = productsCtx.currencySymbol
      ? productsCtx.currencySymbol
      : '$';
    const label = `${currencySymbol}${
      range?.from
        ? (
            parseFloat(currencyRate) * parseInt(range.from.toFixed(0), 10)
          ).toFixed(2)
        : 0
    }${
      range?.to
        ? ` - ${currencySymbol}${(
            parseFloat(currencyRate) * parseInt(range.to.toFixed(0), 10)
          ).toFixed(2)}`
        : ' and above'
    }`;
    return label;
  };

  const formatBinaryLabel = (filter: FacetFilter, option: string) => {
    const category = searchCtx.categoryNames.find(
      (facet) => facet.attribute === filter.attribute && facet.value === option
    );

    if (category?.name) {
      return category.name;
    }

    const title = filter.attribute?.split('_');
    if (option === 'yes') {
      return title.join(' ');
    } else if (option === 'no') {
      return `not ${title.join(' ')}`;
    }
    return option;
  };

  return (
    <div className="ds-plp-facets flex flex-col">
      {searchCtx.filters?.length > 0 && (
        <>
          <div className="border-t border-gray-200" />
          <div className="ds-plp-facets__header flex justify-between align-middle  py-md">
            <span className="ds-plp-facets__header__title ml-0 text-normal">
              Filters
            </span>
            <button
              className="ds-plp-facets__header__clear-all border-none bg-transparent hover:border-none	hover:bg-transparent
              focus:border-none focus:bg-transparent active:border-none active:bg-transparent active:shadow-none text-sm"
              onClick={() => searchCtx.clearFilters()}
            >
              Clear all
            </button>
          </div>

          <div className="ds-plp-facets__pills pb-4 sm:pb-6 flex flex-wrap gap-3">
            {searchCtx.filters.map((filter) => (
              <div className="flex flex-wrap gap-3" key={filter.attribute}>
                {filter.in?.map((option) => (
                  <Pill
                    key={filter.attribute}
                    label={formatBinaryLabel(filter, option)}
                    onClick={() =>
                      searchCtx.updateFilterOptions(filter, option)
                    }
                  />
                ))}
                {filter.range && (
                  <Pill
                    label={formatRangeLabel(filter)}
                    onClick={() => {
                      searchCtx.removeFilter(filter.attribute);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <form className="ds-plp-facets__list border-t border-gray-200">
        {searchFacets?.map((facet) => {
          const bucketType = facet?.buckets[0]?.__typename;

          switch (bucketType) {
            case 'ScalarBucket':
              return <ScalarFacet key={facet.attribute} filterData={facet} />;
            case 'RangeBucket':
              return (
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
