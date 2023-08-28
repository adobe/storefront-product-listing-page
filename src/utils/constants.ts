import { ProductSearchSortInput } from 'src/types/interface';

export const PAGE_SIZE = 24;

export const SEARCH_SORT_DEFAULT: ProductSearchSortInput[] = [
  { attribute: 'relevance', direction: 'DESC' },
];
export const CATEGORY_SORT_DEFAULT: ProductSearchSortInput[] = [
  { attribute: 'position', direction: 'ASC' },
];
