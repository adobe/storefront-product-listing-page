/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { FunctionComponent } from 'preact';

import { useProducts, useSearch, useTranslation } from '../../context';
import Pill from '../Pill';
import { formatBinaryLabel, formatRangeLabel } from './format';

export const SelectedFilters: FunctionComponent = ({}) => {
  const searchCtx = useSearch();
  const productsCtx = useProducts();
  const translation = useTranslation();

  return (
    <div className="inline-flex relative overflow-x-scroll w-full scrollbar-search">
      {searchCtx.filters?.length > 0 && (
        <div className="ds-plp-facets__pills flex">
          {searchCtx.filters.map((filter) => (
            <div key={filter.attribute} className="flex mb-[0.5rem]">
              {filter.in?.map((option) => (
                <Pill
                  key={formatBinaryLabel(
                    filter,
                    option,
                    searchCtx.categoryNames,
                    productsCtx.categoryPath
                  )}
                  label={formatBinaryLabel(
                    filter,
                    option,
                    searchCtx.categoryNames,
                    productsCtx.categoryPath
                  )}
                  type="transparent"
                  onClick={() => searchCtx.updateFilterOptions(filter, option)}
                />
              ))}
              {filter.range && (
                <Pill
                  label={formatRangeLabel(
                    filter,
                    productsCtx.currencyRate,
                    productsCtx.currencySymbol
                  )}
                  type="transparent"
                  onClick={() => {
                    searchCtx.removeFilter(filter.attribute);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
