/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { useSearch } from '../context';
import { FacetFilter, PriceFacet } from '../types/interface';

type ProcessedBucket = { from: number; to: number };

const useRangeFacet = ({attribute, buckets}: PriceFacet) => {
  const processedBuckets: {
    [key: string]: ProcessedBucket;
  } = {};

  buckets.forEach(
    (bucket) =>
      (processedBuckets[bucket.title] = {
        from: bucket.from,
        to: bucket.to,
      })
  );

  console.log(buckets)
  console.log(processedBuckets)

  const searchCtx = useSearch();

  const filter = searchCtx?.filters?.find(
    (e: FacetFilter) => e.attribute === attribute
  );

  const isSelected = (title: string) => {
    const selected = filter
      ? processedBuckets[title].from === filter.range?.from &&
      processedBuckets[title].to === filter.range?.to
      : false;
    return selected;
  };

  const onChange = (value: string) => {
    const fromRange = processedBuckets[value] ? processedBuckets[value].from : parseInt(value.split('-')[0], 10)
    const toRange = processedBuckets[value] ? processedBuckets[value].to : parseInt(value.split('-')[1], 10)

    if (!filter) {
      const newFilter = {
        attribute,
        range: {
          from: fromRange,
          to: toRange,
        },
      };
      searchCtx.createFilter(newFilter);
      return;
    }

    const newFilter = {
      ...filter,
      range: {
        from: fromRange,
        to: toRange,
      },
    };
    searchCtx.updateFilter(newFilter);
  };

  return {isSelected, onChange};
};

export default useRangeFacet;
