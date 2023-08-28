import { MagentoStorefrontEvents } from '@adobe/magento-storefront-events-sdk';

export {};

declare global {
  interface Window {
    LiveSearchPLP: typeof import('../index');
    magentoStorefrontEvents: MagentoStorefrontEvents;
  }
  const Sentry: any;
  const API_URL: string;
  const LS_API_URL: string;
  const API_KEY: string;
  const TEST_URL: string;
  const FLOODGATE_CLIENT_ID: string;
  const FLOODGATE_API_KEY: string;
}
