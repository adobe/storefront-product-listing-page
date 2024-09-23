/*
 * This file is used for development purposes only. Vite builds LiveSearchPLP widget
 * in library mode for production. When developing standalone this is ok, but the app
 * should be tested in a live Magento/Adobe Commerce instance to make sure everything
 * still works.
 */

import mse from "@adobe/magento-storefront-events-sdk";

import { StoreDetails } from "@/types";

import { LiveSearchPLP } from "./LiveSearchPLP";

import "./main.css";

// TODO: check presence of urls
const env = import.meta.env;

// configure storefront events sdk
mse.context.setMagentoExtension({
    magentoExtensionVersion: "1.0.0",
});

mse.context.setSearchExtension({
    version: "2.0.3",
});

mse.context.setShopper({ shopperId: "logged-in" });

mse.context.setPage({
    pageType: "plp",
    maxXOffset: 0,
    maxYOffset: 0,
    minXOffset: 0,
    minYOffset: 0,
    ping_interval: 5,
    pings: 1,
});

mse.context.setStorefrontInstance({
    environmentId: env.CONFIG_ENVIRONMENT_ID ?? "",
    instanceId: "bbbbbb",
    environment: "ccccccc",
    storeUrl: env.CONFIG_SDK_STORE_URL ?? "",
    websiteId: 123456,
    websiteCode: env.CONFIG_WEBSITE_CODE ?? "",
    websiteName: env.CONFIG_WEBSITE_NAME ?? "",
    storeId: 123456,
    storeCode: env.CONFIG_STORE_CODE ?? "",
    storeName: env.CONFIG_STORE_NAME ?? "",
    storeViewId: 123456,
    storeViewCode: env.CONFIG_STORE_VIEW_CODE ?? "",
    storeViewName: env.CONFIG_STORE_VIEW_NAME ?? "",
    baseCurrencyCode: env.CONFIG_BASE_CURRENCY_CODE ?? "",
    storeViewCurrencyCode: env.CONFIG_STORE_VIEW_CURRENCY_CODE ?? "",
    catalogExtensionVersion: "1.0.0",
});

// configure store details
const storeDetails: StoreDetails = {
    environmentId: env.CONFIG_ENVIRONMENT_ID ?? "",
    websiteCode: env.CONFIG_WEBSITE_CODE ?? "",
    storeCode: env.CONFIG_STORE_CODE ?? "",
    storeViewCode: env.CONFIG_STORE_VIEW_CODE ?? "",
    config: {
        minQueryLength: "2",
        pageSize: 8,
        perPageConfig: {
            pageSizeOptions: "12,24,36",
            defaultPageSizeOption: "24",
        },
        currencySymbol: "$",
        currencyRate: "1",
        displaySearchBox: true, // display search box
        displayOutOfStock: true,
        allowAllProducts: false,
        // currentCategoryUrlPath?: '', // current category url path
        // categoryName: '', // name of category to display
        // displaySearchBox: false, // display search box
        // displayOutOfStock: '', // "1" will return from php escapeJs and boolean is returned if called from data-service-graphql
        // displayMode: '', // "" for search || "PAGE" for category search
        // locale: '', //add locale for translations
        // priceSlider: false, //enable slider for price - EXPERIMENTAL, default is false
        // imageCarousel: false, //enable multiple image carousel - EXPERIMENTAL, default is false
        // listview: false; //add listview as an option - EXPERIMENTAL, default is false
        // optimizeImages: true, // optimize images with Fastly
        // imageBaseWidth: 200,
        // resolveCartId?: resolveCartId, // Luma specific addToCart method. Enabled with the extension
        // refreshCart?: refreshCart, // Luma specific addToCart method. Enabled with the extension
        // addToCart?: (sku, options, quantity)=>{} // custom add to cart callback function. Called on addToCart action
    },
    context: {
        customerGroup: env.CONFIG_CUSTOMER_GROUP ?? "",
    },
    apiUrl: env.VITE_API_URL ?? "",
    apiKey: env.VITE_SANDBOX_KEY ?? "",
    // apiKey: "",
    // apiUrl: env.MODE === 'testing' ? TEST_URL : API_URL,
    // apiKey: env.MODE === "testing" && apiKey ? apiKey : env.VITE_SANDBOX_KEY,
    // environmentType?.toLowerCase() === 'testing' && !apiKey
    //     ? SANDBOX_KEY
    //     : apiKey,
    environmentType: env.MODE ?? "",
    // searchQuery: 'search_query', // Optional: providing searchQuery will override 'q' query param
    // route: ({ sku, urlKey  }) => {
    //   const storeConfig = JSON.parse(
    //     document
    //       .querySelector("meta[name='store-config']")
    //       .getAttribute('content')
    //   );
    //   const { storeRootUrl } = storeConfig;
    //   const redirectUrl = storeRootUrl.split('.html')[0];
    //   return `${redirectUrl}/${sku}`;
    // },
    // Will result to `http://localhost:8081/v1/MT11`
};

LiveSearchPLP({ storeDetails, root: document.getElementById("search-plp-root")! });
