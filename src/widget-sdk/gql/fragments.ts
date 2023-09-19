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
            images {
                label
                url
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
