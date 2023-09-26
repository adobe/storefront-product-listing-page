export interface SortMetadata {
  label: string;
  attribute: string;
  numeric: boolean;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface PageSizeOption {
  label: string;
  value: number;
}

export interface GQLSortInput {
  direction: 'ASC' | 'DESC';
  attribute: string;
}
