import { useContext } from 'preact/hooks';
import { SentryContext, SentryType } from 'src/context/sentry';

const useSentry = (): SentryType => {
  return useContext<SentryType>(SentryContext);
};

export { useSentry };
