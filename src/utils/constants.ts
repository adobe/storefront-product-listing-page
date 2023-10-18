import { ProductSearchSortInput } from '../types/interface';

export const DEFAULT_PAGE_SIZE = 24;
export const DEFAULT_PAGE_SIZE_OPTIONS = '12,24,36';
export const DEFAULT_MIN_QUERY_LENGTH = 3;
export const PRODUCT_COLUMNS = {
  desktop: 4,
  tablet: 3,
  mobile: 2,
};

export const SEARCH_SORT_DEFAULT: ProductSearchSortInput[] = [
  { attribute: 'relevance', direction: 'DESC' },
];
export const CATEGORY_SORT_DEFAULT: ProductSearchSortInput[] = [
  { attribute: 'position', direction: 'ASC' },
];
