/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { useSearch } from '../context';
import {
  Facet as FacetType,
  FacetFilter,
  PriceFacet,
} from '../types/interface';

export const useScalarFacet = (facet: FacetType | PriceFacet) => {
  const searchCtx = useSearch();
  const filter = searchCtx?.filters?.find(
    (e: FacetFilter) => e.attribute === facet.attribute
  );

  const isSelected = (attribute: string) => {
    const selected = filter ? filter.in?.includes(attribute) : false;
    return selected;
  };

  const onChange = (value: string, selected?: boolean) => {
    // create filter
    if (!filter) {
      const newFilter: FacetFilter = {
        attribute: facet.attribute,
        in: [value],
      };

      searchCtx.createFilter(newFilter);
      return;
    }

    const newFilter = { ...filter };

    const currentFilterIn = filter.in ? filter.in : [];

    newFilter.in = selected
      ? [...currentFilterIn, value]
      : filter.in?.filter((e: string) => e !== value);

    const filterUnselected = filter.in?.filter(
      (x) => !newFilter.in?.includes(x)
    );

    // update filter
    if (newFilter.in?.length) {
      if (filterUnselected?.length) {
        searchCtx.removeFilter(facet.attribute, filterUnselected[0]);
      }
      searchCtx.updateFilter(newFilter);
      return;
    }

    // remove filter
    if (!newFilter.in?.length) {
      searchCtx.removeFilter(facet.attribute);
      return;
    }
  };

  return { isSelected, onChange };
};

export default useScalarFacet;
