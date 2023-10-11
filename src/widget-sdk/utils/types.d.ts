/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

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
