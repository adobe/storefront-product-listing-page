/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext } from 'preact';
import {MutableRef, useContext, useEffect, useMemo, useRef, useState} from 'preact/hooks';

import { getProductSearch, refineProductSearch } from '../api/search';
import {
  Facet,
  FacetFilter,
  PageSizeOption,
  Product,
  ProductSearchQuery,
  RedirectRouteFunc,
} from '../types/interface';
import {
  CATEGORY_SORT_DEFAULT,
  DEFAULT_MIN_QUERY_LENGTH,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
  SEARCH_SORT_DEFAULT,
} from '../utils/constants';
import {
  getFiltersFromUrl,
  getValueFromUrl,
  handleUrlPagination,
} from '../utils/handleUrlFilters';
import { useAttributeMetadata } from './attributeMetadata';
import { useSearch } from './search';
import { useStore } from './store';
import { useTranslation } from './translation';

interface WithChildrenProps {
  children?: any;
}

const ProductsContext = createContext<{
  variables: ProductSearchQuery;
  loading: boolean;
  items: Product[];
  setItems: (items: Product[]) => void;
  prevItems: Product[];
  setPrevItems: (items: Product[]) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  loadNextPage: number;
  setLoadNextPage: (page: number) => void;
  loadPrevPage: number;
  setLoadPrevPage: (page: number) => void;
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
  setRoute: RedirectRouteFunc | undefined;
  refineProduct: (optionIds: string[], sku: string) => any;
  pageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
  categoryPath: string | undefined;
  viewType: string;
  setViewType: (viewType: string) => void;
  listViewType: string;
  setListViewType: (viewType: string) => void;
  resolveCartId?: () => Promise<string | undefined>;
  refreshCart?: () => void;
  addToCart?: (
    sku: string,
    options: [],
    quantity: number
  ) => Promise<void | undefined>;
}>({
  variables: {
    phrase: '',
  },
  loading: false,
  items: [],
  setItems: () => {},
  prevItems: [],
  setPrevItems: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
  loadNextPage: 1,
  setLoadNextPage: () => {},
  loadPrevPage: 1,
  setLoadPrevPage: () => {},
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
  setRoute: undefined,
  refineProduct: () => {},
  pageLoading: false,
  setPageLoading: () => {},
  categoryPath: undefined,
  viewType: '',
  setViewType: () => {},
  listViewType: '',
  setListViewType: () => {},
  resolveCartId: () => Promise.resolve(''),
  refreshCart: () => {},
  addToCart: () => Promise.resolve(),
});

const ProductsContextProvider = ({ children }: WithChildrenProps) => {
  console.log('********************ProductsContextProvider LOG START********************************');

  const urlValue = getValueFromUrl('p');
  console.log('ProductsContextProvider urlValue',urlValue);
  const pageDefault = urlValue ? Number(urlValue) : 1;
  console.log('ProductsContextProvider pageDefault',pageDefault);

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

  const translation = useTranslation();

  const showAllLabel = translation.ProductContainers.showAll;

  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [items, setItems] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(pageDefault);
  console.log('ProductsContextProvider currentPage',currentPage);

  const [loadNextPage, setLoadNextPage] = useState<number>(pageDefault);
  const [loadPrevPage, setLoadPrevPage] = useState<number>(pageDefault);
  console.log('ProductsContextProvider loadNextPage',loadNextPage);
  console.log('ProductsContextProvider loadPrevPage',loadPrevPage);
  const [prevItems, setPrevItems] = useState<Product[]>([]);
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
  }, [storeCtx?.config.minQueryLength]);
  const categoryPath = storeCtx.config?.currentCategoryUrlPath;

  const viewTypeFromUrl = getValueFromUrl('view_type');
  const [viewType, setViewType] = useState<string>(
    viewTypeFromUrl ? viewTypeFromUrl : 'gridView'
  );
  const [listViewType, setListViewType] = useState<string>('default');

  const variables = useMemo(() => {
    return {
      phrase: searchCtx.phrase,
      filter: searchCtx.filters,
      sort: searchCtx.sort,
      context: storeCtx.context,
      pageSize,
      displayOutOfStock: storeCtx.config.displayOutOfStock,
      currentPage,
      loadNextPage,
      loadPrevPage,
    };
  }, [
    searchCtx.phrase,
    searchCtx.filters,
    searchCtx.sort,
    storeCtx.context,
    storeCtx.config.displayOutOfStock,
    pageSize,
    currentPage,
  ]);

  const handleRefineProductSearch = async (
    optionIds: string[],
    sku: string
  ) => {
    const data = await refineProductSearch({ ...storeCtx, optionIds, sku });
    return data;
  };

  const context = {
    variables,
    loading,
    items,
    setItems,
    prevItems,
    setPrevItems,
    currentPage,
    setCurrentPage,
    loadNextPage,
    setLoadNextPage,
    loadPrevPage,
    setLoadPrevPage,
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
    setRoute: storeCtx.route,
    refineProduct: handleRefineProductSearch,
    pageLoading,
    setPageLoading,
    categoryPath,
    viewType,
    setViewType,
    listViewType,
    setListViewType,
    cartId: storeCtx.config.resolveCartId,
    refreshCart: storeCtx.config.refreshCart,
    resolveCartId: storeCtx.config.resolveCartId,
    addToCart: storeCtx.config.addToCart,
  };
  const prevProds: MutableRef<any[]> = useRef([]);
  const nextPage: MutableRef<number> = useRef(currentPage + 1);
  const prevPage: MutableRef<number> = useRef(currentPage - 1);
  const prevFiltersCount: MutableRef<number> = useRef(searchCtx.filters.length);
  // console.log('prevProds.current',prevProds.current);
  console.log('ProductsContextProvider items',items);
  console.log('ProductsContextProvider prevFiltersCount',prevFiltersCount.current);
  // productsCtx.items= productsCtx.items.concat(prevProds.current);
  // productsCtx.items= productsCtx.items.filter((obj, index, self) =>index ===
  //     self.findIndex((o) => o.product.sku === obj.product.sku));
  // prevProds.current=items;
  const searchProducts = async (pagination?: boolean, currPage?: number) => {
    console.log('********************SEARCHPRODUCTS LOG START********************************');

    try {
      setLoading(true);
      disableScroll();
      // moveToTop();
      if (checkMinQueryLength()) {
        const filters = [...variables.filter];

        handleCategorySearch(categoryPath, filters);
        if (currPage) {
          console.log('SEARCHPRODUCTS variables.currentPage',currPage);
          variables.currentPage = currPage;
        }
        const data = await getProductSearch({
          ...variables,
          ...storeCtx,
          apiUrl: storeCtx.apiUrl,
          filter: filters,
          categorySearch: !!categoryPath,
        });
        console.log('SEARCHPRODUCTS pagination', pagination);
        console.log('SEARCHPRODUCTS filters', searchCtx.filters);
        console.log('SEARCHPRODUCTS !!curr', currentPage);
        setLoadNextPage(currentPage + 1);
        setLoadPrevPage(currentPage - 1);
        prevFiltersCount.current=searchCtx.filters.length;
        if (pagination) {
          if (currentPage == prevPage.current) {
            let dataItems = data?.productSearch?.items || [];
            setPrevItems(prevProds.current);
            prevProds.current = dataItems.concat(prevProds.current);
          } else {
            setPrevItems(prevProds.current);
            prevProds.current = prevProds.current.concat(data?.productSearch?.items || []);
          }
          console.log(currentPage, nextPage.current, prevPage.current);
          setItems(prevProds.current);
          nextPage.current = currentPage >= nextPage.current ? currentPage + 1 : nextPage.current;
          prevPage.current = currentPage <= prevPage.current ? currentPage - 1 : prevPage.current;
          setLoadNextPage(nextPage.current);
          setLoadPrevPage(prevPage.current);
        } else {
          prevProds.current = data?.productSearch?.items || [];
          setItems(data?.productSearch?.items || []);
          nextPage.current = currPage ? currPage + 1 : currentPage + 1;
          prevPage.current = currPage ? currPage - 1 : currentPage - 1;
          setLoadNextPage(nextPage.current);
          setLoadPrevPage(prevPage.current);

        }
        console.log('SEARCHPRODUCTS nextPage', nextPage.current);
        console.log('SEARCHPRODUCTS prevPage', prevPage.current);

        setFacets(data?.productSearch?.facets || []);
        setTotalCount(data?.productSearch?.total_count || 0);
        setTotalPages(data?.productSearch?.page_info?.total_pages || 1);
        handleCategoryNames(data?.productSearch?.facets || []);

        getPageSizeOptions(data?.productSearch?.total_count);

        paginationCheck(
          data?.productSearch?.total_count,
          data?.productSearch?.page_info?.total_pages
        );
      }
      enableScroll();
      setLoading(false);
      setPageLoading(false);
      console.log('********************SEARCHPRODUCTS LOG END********************************');
    } catch (error) {
      setLoading(false);
      setPageLoading(false);
    }
  };

  const checkMinQueryLength = () => {
    if (
      !storeCtx.config?.currentCategoryUrlPath &&
      searchCtx.phrase.trim().length <
        (Number(storeCtx.config.minQueryLength) || DEFAULT_MIN_QUERY_LENGTH)
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
        value: parseInt(option, 10),
      });
    });

    if (storeCtx?.config?.allowAllProducts == '1') {
      // '==' is intentional for conversion
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
      console.log('paginationCheck');
      setCurrentPage(1);
      handleUrlPagination(1);
    }
  };
  const disableScroll = () => {
    // Get the current page scroll position
    let scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop;
    let scrollLeft =
        window.scrollX ||
        document.documentElement.scrollLeft;

        // if any scroll is attempted,
        // set this to the previous value
        window.onscroll = function () {
          window.scrollTo(scrollLeft, scrollTop);
        };
  };
  const enableScroll = () => {
    window.onscroll = function () {
    };
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

  const handleCategoryNames = (facets: Facet[]) => {
    facets.map((facet) => {
      const bucketType = facet?.buckets[0]?.__typename;
      if (bucketType === 'CategoryView') {
        const names = facet.buckets.map((bucket) => {
          if (bucket.__typename === 'CategoryView')
            return {
              name: bucket.name,
              value: bucket.title,
              attribute: facet.attribute,
            };
        });
        searchCtx.setCategoryNames(names);
      }
    });
  };

  useEffect(() => {
    console.log('********************searchCtx.filters LOG START********************************');
    if (attributeMetadataCtx.filterableInSearch) {
      console.log('searchCtx.filters prevFiltersCount', prevFiltersCount.current);
      console.log('searchCtx.filters.length', searchCtx.filters.length);
      if (searchCtx.filters.length == 0) {//Default page load
        console.log('!Default page load no filters searchCtx.filters 1');
        console.log('!Default page load items length', items.length);
        searchProducts();
        // searchProducts(false,1);
        // setCurrentPage(1);
        // handleUrlPagination(1);
      }
      if (searchCtx.filters.length == 0 && prevFiltersCount.current != 0) {//Clear filters
        console.log('!Clear filters searchCtx.filters 2');
        console.log('!Clear filters items length', items.length);

        console.log('searchCtx.filters 2',searchCtx.filters);
        console.log('searchCtx.filters searchCtx.filters.length', searchCtx.filters.length);
        console.log('searchCtx.filters prevFiltersCount.current', prevFiltersCount.current);
        setCurrentPage(1);
        handleUrlPagination(1);
        searchProducts(false, 1);
      }
      if (searchCtx.filters.length != 0 && items.length != 0) {//Enabled Filters
        console.log('!Enabled Filters searchCtx.filters 3');
        console.log('!Enabled Filters items length', items.length);
        console.log('searchCtx.filters 3', searchCtx.filters);
        console.log('searchCtx.filters searchCtx.filters.length', searchCtx.filters.length);
        console.log('searchCtx.filters prevFiltersCount.current', prevFiltersCount.current);
        setCurrentPage(1);
        handleUrlPagination(1);
        searchProducts(false, 1);
      }
      if (searchCtx.filters.length != 0 && items.length == 0) {//Enabled Filters from url params
        console.log('!Enabled Filters from url params searchCtx.filters 4');
        console.log('!Enabled Filters from url params items length', items.length);
        console.log('searchCtx.filters 4', searchCtx.filters);
        console.log('searchCtx.filters searchCtx.filters.length', searchCtx.filters.length);
        console.log('searchCtx.filters prevFiltersCount.current', prevFiltersCount.current);
        searchProducts();
      }
      // searchProducts(false,1);
      console.log('********************searchCtx.filters LOG END********************************');

    }
  }, [searchCtx.filters]);

  useEffect(() => {
    if (attributeMetadataCtx.filterableInSearch) {
      const filtersFromUrl = getFiltersFromUrl(
        attributeMetadataCtx.filterableInSearch
      );
      console.log('attributeMetadataCtx.filterableInSearch');

      searchCtx.setFilters(filtersFromUrl);
    }
  }, [attributeMetadataCtx.filterableInSearch]);

  useEffect(() => {
    if (!loading) {
      console.log('searchCtx.phrase, searchCtx.sort, pageSize');
      searchProducts();
    }
  }, [searchCtx.phrase, searchCtx.sort, pageSize]);

  useEffect(() => {
    if (!loading) {
      console.log('page change');
      searchProducts(true);
    }
  }, [currentPage]);
  console.log('********************ProductsContextProvider LOG END********************************');

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
