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
    <div className="w-full h-full">
      {searchCtx.filters?.length > 0 && (
        <div className="ds-plp-facets__pills sm:pb-6 py-md flex flex-wrap justify-start items-center">
          {searchCtx.filters.map((filter) => (
            <div
              key={filter.attribute}
              className="flex items-center gap-[16px]"
            >
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
                  type="filter"
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
          <div className="py-1">
            <button
              className="ds-plp-facets__header__clear-all border-none bg-transparent hover:border-none	hover:bg-transparent
              focus:border-none focus:bg-transparent active:border-none active:bg-transparent active:shadow-none px-4"
              onClick={() => searchCtx.clearFilters()}
            >
              <span className="font-button-2 text-sm underline hover:no-underline">
                {translation.Filter.clearAll}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
