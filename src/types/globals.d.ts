/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

export {};

declare global {
  interface Window {
    LiveSearchPLP: typeof import('../index');
    adobeDataLayer: any;
  }
  const Sentry: any;
  const API_URL: string;
  const WIDGET_CONFIG_URL: string;
  const LS_API_URL: string;
  const TEST_URL: string;
  const API_KEY: string;
  const SANDBOX_KEY: string;
}
