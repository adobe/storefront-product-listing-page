import { QueryContextInput, RedirectRouteFunc, StoreDetailsConfig } from "./interface";

export interface StoreDetails {
    environmentId: string;
    environmentType: string;
    websiteCode: string;
    storeCode: string;
    storeViewCode: string;
    config: StoreDetailsConfig;
    context?: QueryContextInput;
    apiUrl: string;
    apiKey: string;
    route?: RedirectRouteFunc; // optional product redirect func prop
    searchQuery?: string; // 'q' default search query param if not provided.
}
