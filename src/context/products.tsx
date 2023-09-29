import { createContext } from 'preact';
import { useContext, useEffect, useMemo, useState } from 'preact/hooks';

import { getProductSearch } from '../api/search';
import {
  Facet,
  FacetFilter,
  Product,
  ProductSearchQuery,
} from '../types/interface';
import {
  CATEGORY_SORT_DEFAULT,
  DEFAULT_MIN_QUERY_LENGTH,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  SEARCH_SORT_DEFAULT,
} from '../utils/constants';
import { moveToTop } from '../utils/dom';
import {
  getFiltersFromUrl,
  getValueFromUrl,
  handleUrlPagination,
} from '../utils/handleUrlFilters';
import { PageSizeOption } from '../widget-sdk/utils/types';
import { useAttributeMetadata } from './attributeMetadata';
import { useSearch } from './search';
import { useStore } from './store';
import { TranslationContext } from './translation';

interface WithChildrenProps {
  children?: any;
}

const ProductsContext = createContext<{
  variables: ProductSearchQuery;
  loading: boolean;
  items: Product[];
  setItems: (items: Product[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalCount: number;
  setTotalCount: (count: number) => void;
  totalPages: number;
  setTotalPages: (pages: number) => void;
  facets: Facet[];
  setFacets: (facets: Facet[]) => void;
  categoryName: string;
  setCategoryName: (categoryName: string) => void;
  currencySymbol: string;
  setCurrencySymbol: (currencySymbol: string) => void;
  currencyRate: string;
  setCurrencyRate: (currencyRate: string) => void;
  minQueryLength: string | number;
  minQueryLengthReached: boolean;
  setMinQueryLengthReached: (minQueryLengthReached: boolean) => void;
  pageSizeOptions: PageSizeOption[];
}>({
  variables: {
    phrase: '',
  },
  loading: false,
  items: [],
  setItems: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
  pageSize: DEFAULT_PAGE_SIZE,
  setPageSize: () => {},
  totalCount: 0,
  setTotalCount: () => {},
  totalPages: 0,
  setTotalPages: () => {},
  facets: [],
  setFacets: () => {},
  categoryName: '',
  setCategoryName: () => {},
  currencySymbol: '',
  setCurrencySymbol: () => {},
  currencyRate: '',
  setCurrencyRate: () => {},
  minQueryLength: DEFAULT_MIN_QUERY_LENGTH,
  minQueryLengthReached: false,
  setMinQueryLengthReached: () => {},
  pageSizeOptions: [],
});

const ProductsContextProvider = ({ children }: WithChildrenProps) => {
  const urlValue = getValueFromUrl('p');
  const pageDefault = urlValue ? Number(urlValue) : 1;

  const searchCtx = useSearch();
  const storeCtx = useStore();
  const attributeMetadataCtx = useAttributeMetadata();

  const pageSizeValue = getValueFromUrl('page_size');
  const defaultPageSizeOption =
    Number(storeCtx?.config?.perPageConfig?.defaultPageSizeOption) ||
    DEFAULT_PAGE_SIZE;
  const pageSizeDefault = pageSizeValue
    ? Number(pageSizeValue)
    : defaultPageSizeOption;

  const translation = useContext(TranslationContext);
  const showAllLabel = translation.ProductContainers.showAll;

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(pageDefault);
  const [pageSize, setPageSize] = useState<number>(pageSizeDefault);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [facets, setFacets] = useState<Facet[]>([]);
  const [categoryName, setCategoryName] = useState<string>(
    storeCtx?.config?.categoryName ?? ''
  );
  const [pageSizeOptions, setPageSizeOptions] = useState<PageSizeOption[]>([]);
  const [currencySymbol, setCurrencySymbol] = useState<string>(
    storeCtx?.config?.currencySymbol ?? ''
  );
  const [currencyRate, setCurrencyRate] = useState<string>(
    storeCtx?.config?.currencyRate ?? ''
  );
  const [minQueryLengthReached, setMinQueryLengthReached] =
    useState<boolean>(false);
  const minQueryLength = useMemo(() => {
    return storeCtx?.config?.minQueryLength || DEFAULT_MIN_QUERY_LENGTH;
  }, [storeCtx?.config.minQueryLength, DEFAULT_MIN_QUERY_LENGTH]);

  const variables = useMemo(() => {
    return {
      phrase: searchCtx.phrase,
      filter: searchCtx.filters,
      sort: searchCtx.sort,
      context: storeCtx.context,
      pageSize,
      displayOutOfStock: storeCtx.config.displayOutOfStock,
      currentPage,
    };
  }, [
    searchCtx.phrase,
    searchCtx.filters,
    searchCtx.sort,
    storeCtx.config.displayOutOfStock,
    currentPage,
    pageSize,
  ]);

  const context = {
    variables,
    loading,
    items,
    setItems,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalCount,
    setTotalCount,
    totalPages,
    setTotalPages,
    facets,
    setFacets,
    categoryName,
    setCategoryName,
    currencySymbol,
    setCurrencySymbol,
    currencyRate,
    setCurrencyRate,
    minQueryLength,
    minQueryLengthReached,
    setMinQueryLengthReached,
    pageSizeOptions,
  };

  const searchProducts = async () => {
    try {
      setLoading(true);
      moveToTop();
      if (checkMinQueryLength()) {
        const categoryPath = storeCtx.config?.currentCategoryUrlPath;
        const filters = [...variables.filter];

        handleCategorySearch(categoryPath, filters);

        const data = await getProductSearch({
          ...variables,
          ...storeCtx,
          apiUrl: storeCtx.apiUrl,
          filter: filters,
          categorySearch: !!categoryPath,
        });

        setItems(data?.productSearch?.items || []);
        setFacets(data?.productSearch?.facets || []);
        setTotalCount(data?.productSearch?.total_count || 0);
        setTotalPages(data?.productSearch?.page_info?.total_pages || 1);

        getPageSizeOptions(data?.productSearch?.total_count);

        paginationCheck(
          data?.productSearch?.total_count,
          data?.productSearch?.page_info?.total_pages
        );
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const checkMinQueryLength = () => {
    if (
      !storeCtx.config?.currentCategoryUrlPath &&
      searchCtx.phrase.trim().length <
        (storeCtx.config.minQueryLength || DEFAULT_MIN_QUERY_LENGTH)
    ) {
      setItems([]);
      setFacets([]);
      setTotalCount(0);
      setTotalPages(1);
      setMinQueryLengthReached(false);
      return false;
    }
    setMinQueryLengthReached(true);
    return true;
  };

  const getPageSizeOptions = (totalCount: number | null) => {
    const optionsArray: PageSizeOption[] = [];
    const pageSizeString =
      storeCtx?.config?.perPageConfig?.pageSizeOptions ||
      DEFAULT_PAGE_SIZE_OPTIONS;
    const pageSizeArray = pageSizeString.split(',');
    pageSizeArray.forEach((option) => {
      optionsArray.push({
        label: option,
        value: parseInt(option),
      });
    });

    if (storeCtx?.config?.allowAllProducts) {
      optionsArray.push({
        label: showAllLabel,
        value: totalCount !== null ? (totalCount > 500 ? 500 : totalCount) : 0,
      });
    }
    setPageSizeOptions(optionsArray);
  };

  const paginationCheck = (
    totalCount: number | null,
    totalPages: number | undefined
  ) => {
    if (totalCount && totalCount > 0 && totalPages === 1) {
      setCurrentPage(1);
      handleUrlPagination(1);
    }
  };

  const handleCategorySearch = (
    categoryPath: string | undefined,
    filters: FacetFilter[]
  ) => {
    if (categoryPath) {
      //add category filter
      const categoryFilter = {
        attribute: 'categoryPath',
        eq: categoryPath,
      };
      filters.push(categoryFilter);

      //add default category sort
      if (variables.sort.length < 1 || variables.sort === SEARCH_SORT_DEFAULT) {
        variables.sort = CATEGORY_SORT_DEFAULT;
      }
    }
  };

  useEffect(() => {
    if (attributeMetadataCtx.filterableInSearch) {
      searchProducts();
    }
  }, [searchCtx.filters]);

  useEffect(() => {
    if (attributeMetadataCtx.filterableInSearch) {
      const filtersFromUrl = getFiltersFromUrl(
        attributeMetadataCtx.filterableInSearch
      );
      searchCtx.setFilters(filtersFromUrl);
    }
  }, [attributeMetadataCtx.filterableInSearch]);

  useEffect(() => {
    if (!loading) {
      searchProducts();
    }
  }, [searchCtx.phrase, searchCtx.sort, currentPage, pageSize]);

  return (
    <ProductsContext.Provider value={context}>
      {children}
    </ProductsContext.Provider>
  );
};

const useProducts = () => {
  const productsCtx = useContext(ProductsContext);
  return productsCtx;
};

export { ProductsContextProvider, useProducts };
