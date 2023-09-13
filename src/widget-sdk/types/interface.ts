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
    // image: null | Media;
    // small_image: null | Media;
    // thumbnail: null | Media;
    images: null | Media[];
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
    options: null | Media[];
  };
  highlights: Array<Highlights>;
}

export interface ComplexTextValue {
  html: string;
}

// export interface Price {
//   fixed_product_taxes: null | { amount: Money; label: string };
//   regular_price: Money;
//   final_price: Money;
//   discount: null | { percent_off: number; amount_off: number };

// }

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

export interface Money {
  value: number;
  currency: string;
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
