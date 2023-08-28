//Luma Specific URL handling

import { SearchClauseInput } from 'src/types/interface';

import { DEFAULT_PAGE_SIZE } from '../constants';
import { FacetFilter } from '../types/interface';

const nonFilterKeys = {
  search: 'q',
  pagination: 'p',
  sort: 'product_list_order',
  page_size: 'page_size',
};

const addUrlFilter = (filter: SearchClauseInput) => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.searchParams);
  const attribute = filter.attribute;
  if (filter.range) {
    const filt = filter.range;
    if (getValueFromUrl(attribute)) {
      params.delete(attribute);
      params.append(attribute, `${filt.from}--${filt.to}`);
    } else {
      params.append(attribute, `${filt.from}--${filt.to}`);
    }
  } else {
    const filt = filter.in || [];
    const filterParams = params.getAll(attribute);
    filt.map((f) => {
      if (!filterParams.includes(f)) {
        params.append(attribute, f);
      }
    });
  }
  window.history.pushState({}, '', `${url.pathname}?${params}`);
};

const removeUrlFilter = (name: string, option?: string) => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.searchParams);
  const allValues = url.searchParams.getAll(name);
  params.delete(name);
  if (option) {
    allValues.splice(allValues.indexOf(option), 1);
    allValues.forEach((val) => params.append(name, val));
  }
  window.history.pushState({}, '', `${url.pathname}?${params}`);
};

const removeAllUrlFilters = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.searchParams);
  for (const key of url.searchParams.keys()) {
    // if nonFilterKeys values includes a key from params (for customizing)
    if (!Object.values(nonFilterKeys).includes(key)) {
      params.delete(key);
    }
  }
  window.history.pushState({}, '', `${url.pathname}?${params.toString()}`);
};

const handleUrlSort = (sortOption: string) => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.searchParams);
  params.set('product_list_order', sortOption);
  window.history.pushState({}, '', `${url.pathname}?${params}`);
};

const handleUrlPageSize = (pageSizeOption: number) => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.searchParams);
  if (pageSizeOption === DEFAULT_PAGE_SIZE) {
    params.delete('page_size');
  } else {
    params.set('page_size', pageSizeOption.toString());
  }
  window.history.pushState({}, '', `${url.pathname}?${params}`);
};

const handleUrlPagination = (pageNumber: number) => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.searchParams);
  if (pageNumber === 1) {
    params.delete('p');
  } else {
    params.set('p', pageNumber.toString());
  }
  window.history.pushState({}, '', `${url.pathname}?${params}`);
};

const getFiltersFromUrl = (
  filterableAttributes: string[]
): SearchClauseInput[] => {
  const params = getSearchParams();

  const filters: FacetFilter[] = [];
  for (const [key, value] of params.entries()) {
    // if nonFilterKeys values includes a key from params (for customizing)
    if (
      filterableAttributes.includes(key) &&
      !Object.values(nonFilterKeys).includes(key)
    ) {
      if (value.includes('--')) {
        const range = value.split('--');
        const filter = {
          attribute: key,
          range: { from: Number(range[0]), to: Number(range[1]) },
        };
        filters.push(filter);
      } else {
        const attributeIndex = filters.findIndex(
          (filter) => filter.attribute == key
        );
        if (attributeIndex !== -1) {
          filters[attributeIndex].in?.push(value);
        } else {
          const filter = { attribute: key, in: [value] };
          filters.push(filter);
        }
      }
    }
  }

  return filters;
};

const getValueFromUrl = (param: string) => {
  const params = getSearchParams();
  const filter = params.get(param);
  if (filter) {
    return filter;
  }
  return '';
};

const getSearchParams = () => {
  const search = window.location.search;
  return new URLSearchParams(search);
};

export {
  addUrlFilter,
  removeUrlFilter,
  removeAllUrlFilters,
  handleUrlSort,
  handleUrlPageSize,
  handleUrlPagination,
  getFiltersFromUrl,
  getValueFromUrl,
};
