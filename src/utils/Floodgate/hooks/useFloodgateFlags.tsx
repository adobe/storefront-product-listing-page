import { useContext } from 'preact/compat';
import { FeatureFlags } from 'src/types/interface';

import { FloodgateContext } from '../';

function useFloodgateFlags(): FeatureFlags {
  const floodgateCtx = useContext(FloodgateContext);

  if (floodgateCtx === null) {
    return {};
  }

  return floodgateCtx;
}

export { useFloodgateFlags };
