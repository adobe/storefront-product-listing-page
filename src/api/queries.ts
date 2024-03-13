/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { Facet, Product, ProductView } from './fragments';

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


const CATEGORY_QUERY = `
    query categorySearch($categoryPath: String!) {
        categories(
          filters: {        
            url_key: {in: [$categoryPath]}
          }
        ) {
          items {
              first_cms_block_plp
              first_cms_position_plp
              second_cms_block_plp
              second_cms_position_plp
              third_cms_block_plp
              third_cms_position_plp
              fourth_cms_block_plp
              fourth_cms_position_plp
              fifth_cms_block_plp
              fifth_cms_position_plp
              sixth_cms_block_plp
              sixth_cms_position_plp
          }
        }
      }
`;

const BLOCK_QUERY = `

    query cmsBlockSearch($identifier: [String!]) {
        cmsBlocks(identifiers: $identifier) {
            items {
              identifier
              title
              content
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
                ...ProductView
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
    ${ProductView}
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
            inStock
            url
            urlKey
            images {
                label
                url
                roles
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

const GET_CUSTOMER_CART = `
    query customerCart {
        customerCart {
            id
            items {
            id
            product {
                name
                sku
            }
            quantity
            }
        }
    }
`;

export {
  ATTRIBUTE_METADATA_QUERY,
  GET_CUSTOMER_CART,
  PRODUCT_SEARCH_QUERY,
  QUICK_SEARCH_QUERY,
  REFINE_PRODUCT_QUERY,
  BLOCK_QUERY,
  CATEGORY_QUERY
};
