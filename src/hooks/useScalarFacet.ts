import { useSearch } from '../context';
import { FacetFilter } from '../types/interface';

export const useScalarFacet = (title: string) => {
  const searchCtx = useSearch();
  const filter = searchCtx?.filters?.find(
    (e: FacetFilter) => e.attribute === title
  );

  const isSelected = (title: string) => {
    const selected = filter ? filter.in?.includes(title) : false;
    return selected;
  };

  const onChange = (value: string, selected?: boolean) => {
    // create filter
    if (!filter) {
      const newFilter: FacetFilter = {
        attribute: title,
        in: [value],
      };

      searchCtx.createFilter(newFilter);
      return;
    }

    const newFilter = { ...filter };

    const currentFilterIn = filter.in ? filter.in : [];

    newFilter.in = selected
      ? [...currentFilterIn, value]
      : filter.in?.filter((e: string) => e !== value);

    const filterUnselected = filter.in?.filter(
      (x) => !newFilter.in?.includes(x)
    );

    // update filter
    if (newFilter.in?.length) {
      if (filterUnselected?.length) {
        searchCtx.removeFilter(title, filterUnselected[0]);
      }
      searchCtx.updateFilter(newFilter);
      return;
    }

    // remove filter
    if (!newFilter.in?.length) {
      searchCtx.removeFilter(title);
      return;
    }
  };

  return { isSelected, onChange };
};

export default useScalarFacet;
