import { useSearch } from '../context';
import { FacetFilter, PriceFacet } from '../types/interface';

type ProcessedBucket = { from: number; to: number };

const useRangeFacet = ({ attribute, buckets }: PriceFacet) => {
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

  const searchCtx = useSearch();

  const filter = searchCtx.filters.find(
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
    if (!filter) {
      const newFilter = {
        attribute,
        range: {
          from: processedBuckets[value].from,
          to: processedBuckets[value].to,
        },
      };
      searchCtx.createFilter(newFilter);
      return;
    }

    const newFilter = {
      ...filter,
      range: {
        from: processedBuckets[value].from,
        to: processedBuckets[value].to,
      },
    };
    searchCtx.updateFilter(newFilter);
  };

  return { isSelected, onChange };
};

export default useRangeFacet;
