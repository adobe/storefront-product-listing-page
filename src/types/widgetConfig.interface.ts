/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

// Widget Configuration Options Specific Types
export interface WidgetConfigOptions {
  // pageSize: number; // TODO: phase-2 MSRCH-4164
  // minQueryLength: number; // TODO: phase-2 MSRCH-4164
  // currencySymbol: string; // TODO: phase-2 MSRCH-4164
  // currencyRate: number; // TODO: phase-2 MSRCH-4164
  // displayOutOfStock: boolean; // TODO: phase-2 MSRCH-4164
  // allowAllProducts: boolean; // TODO: phase-2 MSRCH-4164
  badge: Badge;
  price: Price;
  attributeSlot: AttributeSlot;
  addToWishlist: AddToWishlist;
  layout: Layout;
  addToCart: AddToCart;
  stockStatusFilterLook: StockStatusFilterLook;
  swatches: Swatches;
  multipleImages: MultipleImages;
  compare: Compare;
}

type Badge = {
  enabled: boolean;
  label: string;
  attributeCode: string;
  backgroundColor: string;
};

type Price = {
  showNoPrice: boolean;
  showRange: boolean;
  showRegularPrice: boolean;
  showStrikethruPrice: boolean;
};

type AttributeSlot = {
  enabled: boolean;
  attributeCode: string;
  backgroundColor: string;
};

type AddToWishlist = {
  enabled: boolean;
  placement: AddToWishlistPlacement;
};

export type AddToWishlistPlacement =
  | 'inLineWithName' // default
  | 'onCard';

type Layout = {
  defaultLayout: LayoutType;
  allowedLayouts: LayoutType[];
  showToggle: boolean;
};

type LayoutType =
  | 'grid' // default
  | 'list';

type AddToCart = {
  enabled: boolean;
};

type StockStatusFilterLook = 'radio' | 'checkbox' | 'toggle';

type Swatches = {
  enabled: boolean;
  swatchAttributes: SwatchAttribute[];
  swatchesOnPage: number;
};

type SwatchAttribute = {
  attributeCode: string;
  swatchType: SwatchAttributeType;
};

type SwatchAttributeType = 'color' | 'size';

type MultipleImages = {
  enabled: boolean;
  limit: number;
};

type Compare = {
  enabled: boolean;
};
