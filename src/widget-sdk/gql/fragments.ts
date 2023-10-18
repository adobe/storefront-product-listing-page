/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

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
        productView {
            __typename
            sku
            name
            url
            urlKey
            images {
                label
                url
                roles
            }
            ... on ComplexProductView {
                priceRange {
                    maximum {
                        final {
                            amount {
                                value
                                currency
                            }
                        }
                        regular {
                            amount {
                                value
                                currency
                            }
                        }
                    }
                    minimum {
                        final {
                            amount {
                                value
                                currency
                            }
                        }
                        regular {
                            amount {
                                value
                                currency
                            }
                        }
                    }
                }
                options {
                    id
                    title
                    values {
                        title
                        ... on ProductViewOptionValueSwatch {
                            id
                            type
                            value
                        }
                    }
                }
            }
            ... on SimpleProductView {
                price {
                    final {
                        amount {
                            value
                            currency
                        }
                    }
                    regular {
                        amount {
                            value
                            currency
                        }
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
