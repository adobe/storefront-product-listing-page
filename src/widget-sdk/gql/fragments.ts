const Facet = `
    fragment Facet on Aggregation {
        title
        attribute
        buckets {
            title
            ... on ScalarBucket {
                __typename
                count
            }
            ... on RangeBucket {
                __typename
                from
                to
                count
            }
            ... on StatsBucket {
                __typename
                min
                max
            }
        }
    }
`;

const Product = `
    fragment Product on ProductSearchItem {
        product {
            __typename
            sku
            name
            canonical_url
            small_image {
                url
            }
            image {
                url
            }
            thumbnail {
                url
            }
            price_range {
                minimum_price {
                    fixed_product_taxes {
                        amount {
                            value
                            currency
                        }
                        label
                    }
                    regular_price {
                        value
                        currency
                    }
                    final_price {
                        value
                        currency
                    }
                    discount {
                        percent_off
                        amount_off
                    }
                }
                maximum_price {
                    fixed_product_taxes {
                        amount {
                            value
                            currency
                        }
                        label
                    }
                    regular_price {
                        value
                        currency
                    }
                    final_price {
                        value
                        currency
                    }
                    discount {
                        percent_off
                        amount_off
                    }
                }
            }
        }
        highlights {
            attribute
            value
            matched_words
        }
    }
`;

export { Facet, Product };
