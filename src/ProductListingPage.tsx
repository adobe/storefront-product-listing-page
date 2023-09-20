import { render } from 'preact';

import './styles/global.css';

import { getUserViewHistory } from '../src/widget-sdk/utils';
import App from './containers/App';
import {
  AttributeMetadataProvider,
  ProductsContextProvider,
  SearchProvider,
  StoreContextProvider,
  StoreDetailsProps,
} from './context/';
import Resize from './context/displayChange';
import { SentryProvider } from './context/sentry';
import Translation from './context/translation';
import { FloodgateProvider } from './utils/Floodgate';

type MountSearchPlpProps = {
  storeDetails: StoreDetailsProps;
  root: HTMLElement;
};

const LiveSearchPLP = ({ storeDetails, root }: MountSearchPlpProps) => {
  if (!storeDetails) {
    throw new Error("Livesearch PLP's storeDetails prop was not provided");
  }
  if (!root) {
    throw new Error("Livesearch PLP's Root prop was not provided");
  }

  const userViewHistory = getUserViewHistory();

  const updatedStoreDetails = {
    ...storeDetails,
    context: {
      ...storeDetails.context,
      userViewHistory,
    },
  };

  render(
    <SentryProvider>
      <FloodgateProvider>
        <StoreContextProvider {...updatedStoreDetails}>
          <AttributeMetadataProvider>
            <SearchProvider>
              <Resize>
                <Translation>
                  <ProductsContextProvider>
                    <App />
                  </ProductsContextProvider>
                </Translation>
              </Resize>
            </SearchProvider>
          </AttributeMetadataProvider>
        </StoreContextProvider>
      </FloodgateProvider>
    </SentryProvider>,
    root
  );
};

export default LiveSearchPLP;
