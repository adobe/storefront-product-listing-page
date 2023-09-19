import { Facet, Product } from './fragments';

const ATTRIBUTE_METADATA_QUERY = `
    query attributeMetadata {
        attributeMetadata {
        sortable {
            label
            attribute
            numeric
        }
        filterableInSearch {
            label
            attribute
            numeric
        }
        }
    }
`;

const QUICK_SEARCH_QUERY = `
    query quickSearch(
        $phrase: String!
        $pageSize: Int = 20
        $currentPage: Int = 1
        $filter: [SearchClauseInput!]
        $sort: [ProductSearchSortInput!]
        $context: QueryContextInput
    ) {
        productSearch(
            phrase: $phrase
            page_size: $pageSize
            current_page: $currentPage
            filter: $filter
            sort: $sort
            context: $context
        ) {
            suggestions
            items {
                ...Product
            }
            page_info {
                current_page
                page_size
                total_pages
            }
        }
    }
    ${Product}
`;

const PRODUCT_SEARCH_QUERY = `
    query productSearch(
        $phrase: String!
        $pageSize: Int
        $currentPage: Int = 1
        $filter: [SearchClauseInput!]
        $sort: [ProductSearchSortInput!]
        $context: QueryContextInput
    ) {
        productSearch(
            phrase: $phrase
            page_size: $pageSize
            current_page: $currentPage
            filter: $filter
            sort: $sort
            context: $context
        ) {
            total_count
            items {
                ...Product
            }
            facets {
                ...Facet
            }
            page_info {
                current_page
                page_size
                total_pages
            }
        }
        attributeMetadata {
            sortable {
                label
                attribute
                numeric
            }
        }
    }
    ${Product}
    ${Facet}
`;

const REFINE_PRODUCT_QUERY = `
    query refineProduct(
        $optionIds: [String!]!
        $sku: String!
    ) {
        refineProduct(
            optionIds: $optionIds 
            sku: $sku
        ) {
            __typename
            id
            sku
            name
            url
            images {
                label
                url
            }
            ... on SimpleProductView {
                price {
                    final {
                        amount {
                            value
                        }
                    }
                    regular {
                        amount {
                            value
                        }
                    }
                }
            }
            ... on ComplexProductView {
                options {
                    id
                    title
                    required
                    values {
                        id
                        title
    
                    }
                }
                priceRange {
                    maximum {
                        final {
                            amount {
                                value
                            }
                        }
                        regular {
                            amount {
                                value
                            }
                        }
                    }
                    minimum {
                        final {
                            amount {
                                value
                            }
                        }
                        regular {
                            amount {
                                value
                            }
                        }
                    }
                }
            }
        }
    }
`;

export {
  ATTRIBUTE_METADATA_QUERY,
  QUICK_SEARCH_QUERY,
  PRODUCT_SEARCH_QUERY,
  REFINE_PRODUCT_QUERY,
};
