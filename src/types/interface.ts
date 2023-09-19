// API Specific Types
export interface RequestError {
  message: string;
  locations: Array<{ line: number; column: number }>;
  path: Array<string>;
  extensions: {
    errorMessage: string;
    classification: string;
  };
}

export interface ClientProps {
  apiUrl: string;
  environmentId: string;
  websiteCode: string;
  storeCode: string;
  storeViewCode: string;
  apiKey: string;
  xRequestId?: string;
}

export interface StoreDetailsConfig {
  allowAllProducts?: boolean;
  perPageConfig?: { pageSizeOptions?: string; defaultPageSizeOption?: string };
  minQueryLength?: number;
  pageSize?: number;
  currencySymbol?: string;
  currencyRate?: string;
  currentCategoryUrlPath?: string;
  categoryName?: string;
  displaySearchBox?: boolean;
  displayOutOfStock?: string;
  displayMode?: string;
  locale?: string;
}

// Types
export type BucketTypename = 'ScalarBucket' | 'RangeBucket' | 'StatsBucket';

export interface MagentoHeaders {
  environmentId: string;
  websiteCode: string;
  storeCode: string;
  storeViewCode: string;
  apiKey: string;
  xRequestId: string;
  customerGroup: string;
}

export interface ProductSearchQuery {
  phrase: string;
  pageSize?: number;
  currentPage?: number;
  displayOutOfStock?: string;
  filter?: SearchClauseInput[];
  sort?: ProductSearchSortInput[];
  xRequestId?: string;
  context?: QueryContextInput;
  data?: QueryData;
  categorySearch?: boolean;
}

export interface RefineProductQuery {
  optionIds: string[];
  sku: string;
  context?: QueryContextInput;
}

export type QueryResponse<T> = Promise<T>;

export interface SearchClauseInput {
  attribute: string;
  in?: string[];
  eq?: string;
  range?: {
    from: number;
    to: number;
  };
}

export interface ProductSearchSortInput {
  attribute: string;
  direction: 'ASC' | 'DESC';
}

export interface QueryContextInput {
  customerGroup?: string;
  userViewHistory?: { sku: string; dateTime: string }[];
}

export interface QueryData {
  products: boolean;
  facets: boolean;
  suggestions: boolean;
}

export type ProductSearchPromise = QueryResponse<ProductSearchResponse>;

export type AttributeMetadata = {
  attribute: string;
  label: string;
  numeric: boolean;
};

export interface ProductSearchResponse {
  extensions: {
    'request-id': string;
  };
  data: {
    productSearch: {
      total_count: null | number;
      items: null | Array<Product>;
      facets: null | Array<Facet>;
      suggestions?: null | Array<string>;
      related_terms?: null | Array<string>;
      page_info: null | PageInfo;
    };
    attributeMetadata: {
      sortable: AttributeMetadata[];
    };
  };
  errors: Array<RequestError>;
}

export interface AttributeMetadataResponse {
  extensions: {
    'request-id': string;
  };
  data: {
    attributeMetadata: {
      sortable: AttributeMetadata[];
      filterableInSearch: AttributeMetadata[];
    };
  };
}

export interface Product {
  productView: {
    __typename: string;
    id: number;
    uid: string;
    name: string;
    sku: string;
    description: null | ComplexTextValue;
    short_description: null | ComplexTextValue;
    attribute_set_id: null | number;
    meta_title: null | string;
    meta_keyword: null | string;
    meta_description: null | string;
    images: null | Media[];
    // image: null | Media;
    // small_image: null | Media;
    // thumbnail: null | Media;
    new_from_date: null | string;
    new_to_date: null | string;
    created_at: null | string;
    updated_at: null | string;
    price: {
      final: Price;
      regular: Price;
    };
    priceRange: {
      minimum: {
        final: Price;
        regular: Price;
      };
      maximum: {
        final: Price;
        regular: Price;
      };
    };
    gift_message_available: null | string;
    // canonical_url: null | string;
    url: null | string;
    media_gallery: null | Media;
    custom_attributes: null | CustomAttribute;
    add_to_cart_allowed: null | boolean;
    options:
      | null
      | {
          id: null | string;
          title: null | string;
          values: null | SwatchValues[];
        }[];
  };
  highlights: Array<Highlights>;
}

export interface RefinedProduct {
  refineProduct: {
    __typename: string;
    id: number;
    uid: string;
    name: string;
    sku: string;
    description: null | ComplexTextValue;
    short_description: null | ComplexTextValue;
    attribute_set_id: null | number;
    meta_title: null | string;
    meta_keyword: null | string;
    meta_description: null | string;
    images: null | Media[];
    // image: null | Media;
    // small_image: null | Media;
    // thumbnail: null | Media;
    new_from_date: null | string;
    new_to_date: null | string;
    created_at: null | string;
    updated_at: null | string;
    price: {
      final: Price;
      regular: Price;
    };
    priceRange: {
      minimum: {
        final: Price;
        regular: Price;
      };
      maximum: {
        final: Price;
        regular: Price;
      };
    };
    gift_message_available: null | string;
    // canonical_url: null | string;
    url: null | string;
    media_gallery: null | Media;
    custom_attributes: null | CustomAttribute;
    add_to_cart_allowed: null | boolean;
    options:
      | null
      | {
          id: null | string;
          title: null | string;
          values: null | SwatchValues[];
        }[];
  };
  highlights: Array<Highlights>;
}

export interface ComplexTextValue {
  html: string;
}
export interface Money {
  value: number;
  currency: string;
}

export interface Price {
  adjustments: null | { amount: number; code: string };
  amount: Money;
}

export interface Media {
  url: null | string;
  label: null | string;
  position: null | number;
  disabled: null | boolean;
}

export interface SwatchValues {
  title: null | string;
  id: null | string;
  type: null | string;
  value: null | string;
}

export interface CustomAttribute {
  code: string;
  value: string;
}

export interface Highlights {
  attribute: string;
  value: string;
  matched_words: Array<string>;
}

export interface PageInfo {
  current_page: number;
  page_size: number;
  total_pages: number;
}

export interface Facet {
  __typename?: BucketTypename;
  title: string;
  attribute: string;
  type?: 'PINNED' | 'INTELLIGENT' | 'POPULAR';
  buckets: Array<RangeBucket | ScalarBucket | StatsBucket>;
}

export interface RangeBucket {
  __typename: 'RangeBucket';
  title: string;
  from: number;
  to: number;
  count: number;
}

export interface ScalarBucket {
  __typename: 'ScalarBucket';
  title: string;
  id?: string;
  count: number;
}

export interface StatsBucket {
  __typename: 'StatsBucket';
  title: string;
  min: number;
  max: number;
}

export interface PriceFacet extends Facet {
  buckets: RangeBucket[];
}

export interface FacetFilter {
  attribute: string;
  in?: string[];
  eq?: string;
  range?: {
    from: number;
    to: number;
  };
}

export interface FeatureFlags {
  [key: string]: boolean;
}
