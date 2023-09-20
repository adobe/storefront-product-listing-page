import { FunctionComponent } from 'preact';
import { useContext } from 'preact/hooks';
import { Facet } from 'src/types/interface';

import { TranslationContext } from '../../context/translation';
import { Facets } from '../Facets';

interface CategoryFiltersProps {
  loading: boolean;
  totalCount: number;
  facets: Facet[];
  categoryName: string;
  phrase: string;
}

export const CategoryFilters: FunctionComponent<CategoryFiltersProps> = ({
  loading,
  totalCount,
  facets,
  categoryName,
  phrase,
}) => {
  const translation = useContext(TranslationContext);
  let title = categoryName || '';
  if (phrase) {
    const text = translation.CategoryFilters.results;
    title = text.replace('{phrase}', `"${phrase}"`);
  }

  return (
    <div class="hidden sm:flex ds-widgets-_actions relative max-w-[21rem] w-full h-full px-2 pb-lg  flex-col overflow-y-auto">
      <div className="ds-widgets_actions_header flex justify-between items-center mb-md">
        {title && <span> {title}</span>}
        {!loading && (
          <span className="text-primary text-sm">
            {totalCount} {translation.CategoryFilters.products}
          </span>
        )}
      </div>
      <Facets searchFacets={facets} />
    </div>
  );
};
