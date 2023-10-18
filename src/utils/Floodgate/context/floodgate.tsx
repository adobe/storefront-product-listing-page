/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext, FC, useEffect, useState } from 'preact/compat';
import { FeatureFlags } from '../../../types/interface';

const FloodgateContext = createContext({});

interface FloodgateProviderProps {
  mockedFlags?: FeatureFlags;
  children: any;
}

const FloodgateProvider: FC<FloodgateProviderProps> = ({
  mockedFlags,
  children,
}) => {
  const [flags, setFlags] = useState<FeatureFlags>({});

  const setFlagsFromFloodgate = async () => {
    const headers = { 'x-api-key': FLOODGATE_API_KEY };
    const envId =
      document
        .getElementById('root')
        ?.getAttribute('floodgate-environment-id') || 'prod';

    const url = `https://p13n-mr.adobe.io/fg/api/v3/feature?clientId=${FLOODGATE_CLIENT_ID}${
      envId && `&envId2=${envId}`
    }`;

    try {
      const response = await fetch(url, { headers });
      const data = await response.json();

      // If a key is present within the response it is enabled, otherwise it won't be returned.
      const flags = data.releases[0].features.reduce(
        (allFlags: FeatureFlags, flag: string) => ({
          ...allFlags,
          [flag]: true,
        }),
        {}
      );

      setFlags(flags);
    } catch (error) {
      // Catching this error and doing nothing about it.
      // This is to prevent console errors for Magento users who
      // have not yet updated their extension.
    }
  };

  useEffect(() => {
    if (mockedFlags) {
      setFlags(mockedFlags);
    } else {
      setFlagsFromFloodgate();
    }
  }, [mockedFlags]);

  const context: FeatureFlags = {
    ...flags,
  };

  return (
    <FloodgateContext.Provider value={context}>
      {children}
    </FloodgateContext.Provider>
  );
};

export { FloodgateContext, FloodgateProvider };
