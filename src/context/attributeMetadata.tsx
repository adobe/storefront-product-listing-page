/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext, FunctionComponent } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

import { getAttributeMetadata } from '../api/search';
import { AttributeMetadata } from '../types/interface';
import { useStore } from './store';

interface WithChildrenProps {
  children?: any;
}

export interface AttributeMetaDataProps extends WithChildrenProps {
  sortable: AttributeMetadata[];
  filterableInSearch: string[] | null;
}

const AttributeMetadataContext = createContext<AttributeMetaDataProps>({
  sortable: [],
  filterableInSearch: [],
});

const AttributeMetadataProvider: FunctionComponent = ({ children }) => {
  const [attributeMetadata, setAttributeMetadata] =
    useState<AttributeMetaDataProps>({
      sortable: [],
      filterableInSearch: null,
    });

  const storeCtx = useStore();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAttributeMetadata({
        ...storeCtx,
        apiUrl: storeCtx.apiUrl,
      });
      if (data?.attributeMetadata) {
        setAttributeMetadata({
          sortable: data.attributeMetadata.sortable as AttributeMetadata[],
          filterableInSearch: data.attributeMetadata.filterableInSearch.map(
            (attribute) => attribute.attribute
          ),
        });
      }
    };

    fetchData();
  }, []);

  const attributeMetadataContext = {
    ...attributeMetadata,
  };

  return (
    <AttributeMetadataContext.Provider value={attributeMetadataContext}>
      {children}
    </AttributeMetadataContext.Provider>
  );
};

const useAttributeMetadata = () => {
  const attributeMetadataCtx = useContext(AttributeMetadataContext);
  return attributeMetadataCtx;
};

export { AttributeMetadataProvider, useAttributeMetadata };
