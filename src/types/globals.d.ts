import { MagentoStorefrontEvents } from '@adobe/magento-storefront-events-sdk';

export {};

declare global {
  interface Window {
    LiveSearchPLP: typeof import('../index');
    magentoStorefrontEvents: MagentoStorefrontEvents;
  }
  const API_URL: string;
  const TEST_URL: string;
  const API_KEY: string;
  const SANDBOX_KEY: string;
}
