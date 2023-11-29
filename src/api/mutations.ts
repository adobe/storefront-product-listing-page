const CREATE_EMPTY_CART = `
  mutation createEmptyCart($input: createEmptyCartInput) {
    createEmptyCart(input: $input)
  }
`;

export { CREATE_EMPTY_CART };
