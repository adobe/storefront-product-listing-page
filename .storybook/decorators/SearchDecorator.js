import { useState } from 'preact/compat';
import { useParameter } from '@storybook/addons';
import { SearchContext } from '../../src/context';

export const SearchDecorator = (Story, context) => {
  const initialState = useParameter('search', {
    phrase: 'green',
    filters: [{ attribute: 'price', range: { from: 50, to: 75 } }],
    setPhrase: () => {},
    setFilters: () => {},
    createFilter: () => {},
    updateFilter: () => {},
    updateFilterOptions: () => {},
    removeFilter: () => {},
    clearFilters: () => {},
  });

  const [state, setState] = useState({ ...initialState });

  return (
    <div>
      <SearchContext.Provider value={state}>
        <Story />
      </SearchContext.Provider>
    </div>
  );
};
