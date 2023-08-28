import { MagentoStorefrontEvents } from "@adobe/magento-storefront-events-sdk";

export {};

declare global {
    interface Window {
        magentoStorefrontEvents: MagentoStorefrontEvents;
    }
}
