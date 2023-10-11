import { FunctionComponent } from 'preact';
import { useContext } from 'preact/hooks';
import { Facet } from 'src/types/interface';

import { TranslationContext } from '../../context/translation';
import { FilterButton } from '../../widget-sdk/ui-kit';
import { Facets } from '../Facets';

interface CategoryFiltersProps {
  loading: boolean;
  totalCount: number;
  facets: Facet[];
  categoryName: string;
  phrase: string;
  setShowFilters: (showFilters: boolean) => void;
}

export const CategoryFilters: FunctionComponent<CategoryFiltersProps> = ({
  loading,
  totalCount,
  facets,
  categoryName,
  phrase,
  setShowFilters,
}) => {
  const translation = useContext(TranslationContext);
  let title = categoryName || '';
  if (phrase) {
    const text = translation.CategoryFilters.results;
    title = text.replace('{phrase}', `"${phrase}"`);
  }

  return (
    <div class="hidden sm:flex ds-widgets-_actions relative max-w-[21rem] w-full h-full px-2 flex-col overflow-y-auto">
      <div className="ds-widgets_actions_header flex justify-between items-center mb-md">
        {title && <span> {title}</span>}
        {!loading && (
          <span className="text-primary text-sm">
            {totalCount} {translation.CategoryFilters.products}
          </span>
        )}
      </div>

      <div className="flex pb-4 w-full h-full">
        <FilterButton
          displayFilter={() => setShowFilters(false)}
          type="desktop"
          title={translation.Filter.hideTitle}
        />
      </div>
      <Facets searchFacets={facets} />
    </div>
  );
};
