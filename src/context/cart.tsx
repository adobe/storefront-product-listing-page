/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext, FunctionComponent } from 'preact';
import { useContext, useState } from 'preact/hooks';

import { getGraphQL } from '../api/graphql';
import { ADD_TO_CART, CREATE_EMPTY_CART } from '../api/mutations';
import { GET_CUSTOMER_CART } from '../api/queries';

export interface CartAttributesContext {
  cart: CartProps;
  createEmptyCartID: () => Promise<{ createEmptyCart: string }>;
  initializeCustomerCart: () => Promise<string>;
  addToCart: (cartId: string, sku: string) => Promise<any>;
}

interface CartProps {
  cartId: '';
}

const CartContext = createContext({} as CartAttributesContext);

const useCart = (): CartAttributesContext => {
  return useContext(CartContext);
};

const CartProvider: FunctionComponent = ({ children }) => {
  const [cart, setCart] = useState<CartProps>({ cartId: '' });

  const initializeCustomerCart = async (): Promise<string> => {
    const customerResponse = await getGraphQL(GET_CUSTOMER_CART);
    const cartId = customerResponse?.customerCart?.id;
    setCart({ ...cart, cartId });
    return cartId ?? '';
  };

  const createEmptyCartID = async (): Promise<{ createEmptyCart: string }> => {
    const response = await getGraphQL(CREATE_EMPTY_CART);
    const cartId = response.createEmptyCart;
    setCart({ ...cart, cartId });
    return response;
  };

  const addToCart = async (cartId: string, sku: string) => {
    const cartItems = [
      {
        quantity: 1,
        sku,
      },
    ];

    const variables = {
      cartId,
      cartItems,
    };

    const response = await getGraphQL(ADD_TO_CART, variables);
    return response;
  };

  const cartContext: CartAttributesContext = {
    cart,
    createEmptyCartID,
    initializeCustomerCart,
    addToCart,
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
};

export { CartProvider, useCart };
