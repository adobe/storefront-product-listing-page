/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext, FunctionComponent, useContext } from 'preact/compat';
import { useState } from 'preact/hooks';
import { useEffect } from 'react';

import {
  FacetFilter,
  ProductSearchSortInput,
  SearchClauseInput,
} from '../types/interface';
import { SEARCH_SORT_DEFAULT } from '../utils/constants';
import {
  addUrlFilter,
  getValueFromUrl,
  removeAllUrlFilters,
  removeUrlFilter,
} from '../utils/handleUrlFilters';
import { generateGQLSortInput } from '../utils/sort';
import { useStore } from './store';
import store from "store2";

interface SearchContextProps {
  phrase: string;
  categoryPath: string;
  filters: FacetFilter[];
  sort: ProductSearchSortInput[];
  setPhrase: any; // FIXME: replace all any with type
  setCategoryPath: any;
  setFilters: any;
  setSort: any;
  setCategoryNames: any;
  filterCount: number;
  categoryNames: { name: string; value: string; attribute: string }[];
  createFilter: (filter: FacetFilter) => void;
  updateFilter: (filter: FacetFilter) => void;
  updateFilterOptions(filter: FacetFilter, option: string): void;
  removeFilter: (name: string, option?: string) => void;
  clearFilters: () => void;
  displayFranchises: boolean;
}

export const SearchContext = createContext({} as SearchContextProps);

const SearchProvider: FunctionComponent = ({ children }) => {
  const storeCtx = useStore();
  const phraseFromUrl = getValueFromUrl(storeCtx.searchQuery || 'q');

  const sortFromUrl = getValueFromUrl('product_list_order');

  const graphQLSort = generateGQLSortInput(sortFromUrl);
  const sortDefault = graphQLSort
    ? (graphQLSort as ProductSearchSortInput[])
    : SEARCH_SORT_DEFAULT; // default to "relevance" sort

  const [phrase, setPhrase] = useState<string>(phraseFromUrl);
  const [categoryPath, setCategoryPath] = useState<string>('');
  const [filters, setFilters] = useState<SearchClauseInput[]>([]);
  const [categoryNames, setCategoryNames] = useState<
    { name: string; value: string; attribute: string }[]
  >([]);
  const [sort, setSort] = useState<ProductSearchSortInput[]>(sortDefault);
  const [filterCount, setFilterCount] = useState<number>(0);

  const createFilter = (filter: SearchClauseInput) => {
    const newFilters = [...filters, filter];
    setFilters(newFilters);
    addUrlFilter(filter);
  };

  const updateFilter = (filter: SearchClauseInput) => {
    const newFilters = [...filters];
    const index = newFilters.findIndex((e) => e.attribute === filter.attribute);
    newFilters[index] = filter;
    setFilters(newFilters);
    addUrlFilter(filter);
  };

  const removeFilter = (name: string, option?: string) => {
    const newFilters = [...filters].filter((e) => {
      return e.attribute !== name;
    });
    setFilters(newFilters);
    removeUrlFilter(name, option);
  };

  const clearFilters = () => {
    removeAllUrlFilters();
    setFilters([]);
  };

  const updateFilterOptions = (
    facetFilter: SearchClauseInput,
    option: string
  ) => {
    const newFilters = [...filters].filter(
      (e) => e.attribute !== facetFilter.attribute
    );
    const newOptions = facetFilter.in?.filter((e) => e !== option);

    newFilters.push({
      attribute: facetFilter.attribute,
      in: newOptions,
    });
    if (newOptions?.length) {
      setFilters(newFilters);
      removeUrlFilter(facetFilter.attribute, option);
    } else {
      removeFilter(facetFilter.attribute, option);
    }
  };

  const getFilterCount = (filters: SearchClauseInput[]) => {
    let count = 0;
    filters.forEach((filter) => {
      if (filter.in) {
        count += filter.in.length;
      } else {
        count += 1;
      }
    });
    return count;
  };

  useEffect(() => {
    const count = getFilterCount(filters);
    setFilterCount(count);
  }, [filters]);

  const displayFranchises = (storeCtx.config.displayByFranchise || false)
    && (filters.length === 0)
    && (sort.length === 1)
    && (sort[0].attribute === 'relevance');

  const context: SearchContextProps = {
    phrase,
    categoryPath,
    filters,
    sort,
    categoryNames,
    filterCount,
    setPhrase,
    setCategoryPath,
    setFilters,
    setCategoryNames,
    setSort,
    createFilter,
    updateFilter,
    updateFilterOptions,
    removeFilter,
    clearFilters,
    displayFranchises,
  };

  return (
    <SearchContext.Provider value={context}>{children}</SearchContext.Provider>
  );
};

const useSearch = () => {
  const searchCtx = useContext(SearchContext);
  return searchCtx;
};

export { SearchProvider, useSearch };
