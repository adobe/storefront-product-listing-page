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
import { ADD_TO_CART } from '../api/mutations';
import { GET_CUSTOMER_CART } from '../api/queries';
import { useProducts } from './products';

export interface CartAttributesContext {
  cart: CartProps;
  initializeCustomerCart: () => Promise<string>;
  addToCart: (sku: string) => Promise<any>;
  refreshCart?: () => void;
}

interface CartProps {
  cartId: string;
}

const CartContext = createContext({} as CartAttributesContext);

const useCart = (): CartAttributesContext => {
  return useContext(CartContext);
};

const CartProvider: FunctionComponent = ({ children }) => {
  const [cart, setCart] = useState<CartProps>({ cartId: '' });
  const { refreshCart, resolveCartId } = useProducts();

  const initializeCustomerCart = async (): Promise<string> => {
    let cartId = '';
    if (!resolveCartId) {
      const customerResponse = await getGraphQL(GET_CUSTOMER_CART);
      cartId = customerResponse?.data.customerCart?.id ?? '';
    } else {
      cartId = (await resolveCartId()) ?? '';
    }
    setCart({ ...cart, cartId });
    return cartId;
  };

  const addToCart = async (sku: string) => {
    let cartId = cart.cartId;
    if (!cartId) {
      cartId = await initializeCustomerCart();
    }
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
    initializeCustomerCart,
    addToCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
};

export { CartProvider, useCart };
