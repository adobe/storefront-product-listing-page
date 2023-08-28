import { generateGQLSortInput } from '../widget-sdk/utils/sort';
import { createContext, FunctionComponent, useContext } from 'preact/compat';
import { useState } from 'preact/hooks';

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

interface SearchContextProps {
  phrase: string;
  categoryPath: string;
  filters: FacetFilter[];
  sort: ProductSearchSortInput[];
  setPhrase: any; // FIXME: replace all any with type
  setCategoryPath: any;
  setFilters: any;
  setSort: any;
  createFilter: (filter: FacetFilter) => void;
  updateFilter: (filter: FacetFilter) => void;
  updateFilterOptions(filter: FacetFilter, option: string): void;
  removeFilter: (name: string, option?: string) => void;
  clearFilters: () => void;
}

export const SearchContext = createContext({} as SearchContextProps);

const SearchProvider: FunctionComponent = ({ children }) => {
  const phraseFromUrl = getValueFromUrl('q');

  const sortFromUrl = getValueFromUrl('product_list_order');

  const graphQLSort = generateGQLSortInput(sortFromUrl);
  const sortDefault = graphQLSort
    ? (graphQLSort as ProductSearchSortInput[])
    : SEARCH_SORT_DEFAULT; // default to "relevance" sort

  const [phrase, setPhrase] = useState<string>(phraseFromUrl);
  const [categoryPath, setCategoryPath] = useState<string>('');
  const [filters, setFilters] = useState<SearchClauseInput[]>([]);
  const [sort, setSort] = useState<ProductSearchSortInput[]>(sortDefault);

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

  const context: SearchContextProps = {
    phrase,
    categoryPath,
    filters,
    sort,
    setPhrase,
    setCategoryPath,
    setFilters,
    setSort,
    createFilter,
    updateFilter,
    updateFilterOptions,
    removeFilter,
    clearFilters,
  };

  return (
    <SearchContext.Provider value={context}>{children}</SearchContext.Provider>
  );
};

const useSearch = () => {
  const searchCtx = useContext(SearchContext);
  return searchCtx;
};

export { useSearch, SearchProvider };
