/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { useContext } from 'preact/compat';

import { FeatureFlags } from '../../../types/interface';
import { FloodgateContext } from '../';

function useFloodgateFlags(): FeatureFlags {
  const floodgateCtx = useContext(FloodgateContext);

  if (floodgateCtx === null) {
    return {};
  }

  return floodgateCtx;
}

export { useFloodgateFlags };
