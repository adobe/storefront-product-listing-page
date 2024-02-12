/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { useSearch } from '../context';
import { FacetFilter, PriceFacet } from '../types/interface';

const useSliderFacet = ({ attribute }: PriceFacet) => {
  const searchCtx = useSearch();

  const onChange = (from: number, to: number) => {
    const filter = searchCtx?.filters?.find(
      (e: FacetFilter) => e.attribute === attribute
    );

    if (!filter) {
      const newFilter = {
        attribute,
        range: {
          from,
          to,
        },
      };
      searchCtx.createFilter(newFilter);
      return;
    }

    const newFilter = {
      ...filter,
      range: {
        from,
        to,
      },
    };
    searchCtx.updateFilter(newFilter);
  };

  return { onChange };
};

export default useSliderFacet;
