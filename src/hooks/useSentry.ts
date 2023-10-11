/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { useContext } from 'preact/hooks';
import { SentryContext, SentryType } from 'src/context/sentry';

const useSentry = (): SentryType => {
  return useContext<SentryType>(SentryContext);
};

export { useSentry };
