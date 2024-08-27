/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import {
  SearchBucket,
  SearchFacet,
  SearchFilter,
  SearchInputUnit,
  SearchResultProduct,
  SearchResultSuggestion,
  SearchResultUnit,
  SearchSort,
} from '@adobe/magento-storefront-events-sdk/dist/types/types/schemas';

import { ProductSearchResponse, RedirectRouteFunc } from '../types/interface';

const updateSearchInputCtx = (
  searchUnitId: string,
  searchRequestId: string,
  phrase: string,
  filters: Array<SearchFilter>,
  pageSize: number,
  currentPage: number,
  sort: Array<SearchSort>
): void => {
  window.adobeDataLayer.push((dl: any) => {
    const searchInputCtx = dl.getState('searchInputContext') ?? { units: [] };

    // create search input unit
    const searchInputUnit: SearchInputUnit = {
      searchUnitId,
      searchRequestId,
      queryTypes: ['products', 'suggestions'],
      phrase,
      pageSize,
      currentPage,
      filter: filters,
      sort,
    };

    // find search input unit index
    const searchInputUnitIndex = searchInputCtx.units.findIndex(
      (unit: any) => unit.searchUnitId === searchUnitId
    );

    // update search input unit
    if (searchInputUnitIndex < 0) {
      searchInputCtx.units.push(searchInputUnit);
    } else {
      searchInputCtx.units[searchInputUnitIndex] = searchInputUnit;
    }

    dl.push({ searchInputContext: searchInputCtx });
  });
};

const updateSearchResultsCtx = (
  searchUnitId: string,
  searchRequestId: string,
  results: ProductSearchResponse['data']['productSearch'],
  route?: RedirectRouteFunc
): void => {
  window.adobeDataLayer.push((dl: any) => {
    const searchResultsCtx = dl.getState('searchResultsContext') ?? {
      units: [],
    };

    // find search result unit index
    const searchResultUnitIndex = searchResultsCtx.units.findIndex(
      (unit: any) => unit.searchUnitId === searchUnitId
    );

    // create search result unit
    const searchResultUnit: SearchResultUnit = {
      searchUnitId,
      searchRequestId,
      products: createProducts(results.items, route),
      categories: [],
      suggestions: createSuggestions(results.suggestions),
      page: results?.page_info?.current_page || 1,
      perPage: results?.page_info?.page_size || 20,
      facets: createFacets(results.facets),
    };

    // update search result unit
    if (searchResultUnitIndex < 0) {
      searchResultsCtx.units.push(searchResultUnit);
    } else {
      searchResultsCtx.units[searchResultUnitIndex] = searchResultUnit;
    }

    dl.push({ searchResultsContext: searchResultsCtx });
  });
};

const createProducts = (
  items: ProductSearchResponse['data']['productSearch']['items'],
  route?: RedirectRouteFunc
): SearchResultProduct[] => {
  if (!items) {
    return [];
  }

  const products: SearchResultProduct[] = items.map((item, index) => ({
    name: item?.product?.name,
    sku: item?.product?.sku,
    url: route
      ? route({
          sku: item?.productView?.sku,
          urlKey: item?.productView?.urlKey,
        })
      : item?.product?.canonical_url ?? '',
    imageUrl: item?.productView?.images?.length
      ? item?.productView?.images[0].url ?? ''
      : '',
    price:
      item?.productView?.price?.final?.amount?.value ??
      item?.product?.price_range?.minimum_price?.final_price?.value,
    priceRange: item?.productView?.priceRange,
    rank: index,
    ratingCount: item?.productView?.attributes.find((attr) => attr.name === 'bv_rating_count')?.value ?? '0',
    ratingAverage: item?.productView?.attributes.find((attr) => attr.name === 'bv_rating_average')?.value ?? '0',
    articleNumber: item?.productView?.attributes.find((attr) => attr.name === 'pim_article_code')?.value || '',
    modelNumber: item?.productView?.attributes.find((attr) => attr.name === 'pim_model_code')?.value || '',
    season: item?.productView?.attributes.find((attr) => attr.name === 'pim_season_dev')?.value || '',
  }));

  return products;
};

const createSuggestions = (
  items: ProductSearchResponse['data']['productSearch']['suggestions']
): SearchResultSuggestion[] => {
  if (!items) {
    return [];
  }

  const suggestions: SearchResultSuggestion[] = items.map(
    (suggestion, index) => ({
      suggestion,
      rank: index,
    })
  );

  return suggestions;
};

const createFacets = (
  items: ProductSearchResponse['data']['productSearch']['facets']
): SearchFacet[] => {
  if (!items) {
    return [];
  }

  const facets = items.map<SearchFacet>((item) => ({
    attribute: item?.attribute,
    title: item?.title,
    type: item?.type || 'PINNED',
    buckets: item?.buckets.map<SearchBucket>((bucket) => bucket),
  }));

  return facets;
};

export { updateSearchInputCtx, updateSearchResultsCtx };
