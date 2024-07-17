const CREATE_EMPTY_CART = `
  mutation createEmptyCart($input: createEmptyCartInput) {
    createEmptyCart(input: $input)
  }
`;

const ADD_TO_CART = `
  mutation addProductsToCart(
    $cartId: String!
    $cartItems: [CartItemInput!]!
  ) {
      addProductsToCart(
        cartId: $cartId
        cartItems: $cartItems
      ) {
          cart {
            items {
              product {
                name
                sku
              }
              quantity
            }
          }
          user_errors {
            code
            message
          }
      }
  }
`;

export { ADD_TO_CART, CREATE_EMPTY_CART };
