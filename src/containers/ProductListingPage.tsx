/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { render } from 'preact';

import './styles/index.css';

import {
  AttributeMetadataProvider,
  ProductsContextProvider,
  SearchProvider,
  StoreContextProvider,
  StoreDetailsProps,
} from '../context';
import Resize from '../context/displayChange';
import Translation from '../context/translation';
import { getUserViewHistory } from '../utils/getUserViewHistory';
import App from './App';

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
    </StoreContextProvider>,
    root
  );
};

export default LiveSearchPLP;
