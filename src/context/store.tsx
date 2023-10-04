import { createContext } from 'preact';
import { useContext, useMemo } from 'preact/hooks';

import {
  QueryContextInput,
  RedirectRouteFunc,
  StoreDetailsConfig,
} from '../types/interface';

interface WithChildrenProps {
  children?: any;
}

export interface StoreDetailsProps extends WithChildrenProps {
  environmentId: string;
  environmentType: string;
  websiteCode: string;
  storeCode: string;
  storeViewCode: string;
  config: StoreDetailsConfig;
  context?: QueryContextInput;
  apiUrl: string;
  apiKey: string;
  route?: RedirectRouteFunc; // optional product redirect func prop (used in AEM/CIF)
  searchQuery?: string; // 'q' default search query param if not provided.
}

const StoreContext = createContext<StoreDetailsProps>({
  environmentId: '',
  environmentType: '',
  websiteCode: '',
  storeCode: '',
  storeViewCode: '',
  apiUrl: '',
  apiKey: '',
  config: {},
  context: {},
  route: undefined,
  searchQuery: 'q',
});

const StoreContextProvider = ({
  children,
  environmentId,
  environmentType,
  websiteCode,
  storeCode,
  storeViewCode,
  config,
  context,
  apiKey,
  route,
  searchQuery,
}: StoreDetailsProps) => {
  const storeProps = useMemo(
    () => ({
      environmentId,
      environmentType,
      websiteCode,
      storeCode,
      storeViewCode,
      config,
      context: {
        customerGroup: context?.customerGroup ?? '',
        userViewHistory: context?.userViewHistory ?? [],
      },
      apiUrl: environmentType?.toLowerCase() === 'testing' ? TEST_URL : API_URL,
      apiKey: environmentType?.toLowerCase() === 'testing' ? API_KEY : apiKey,
      route,
      searchQuery,
    }),
    [environmentId, websiteCode, storeCode, storeViewCode]
  );

  const storeContext = {
    ...storeProps,
  };

  return (
    <StoreContext.Provider value={storeContext}>
      {children}
    </StoreContext.Provider>
  );
};

const useStore = () => {
  const storeCtx = useContext(StoreContext);
  return storeCtx;
};

export { StoreContextProvider, useStore };
