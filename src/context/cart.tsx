/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { createContext, FunctionComponent } from 'preact';
import { useContext, useState } from 'preact/hooks';

import { createEmptyCart } from '../api/graphql';

export interface CartAttributesContext {
  cart: CartProps;
  createEmptyCartID: () => Promise<{ createEmptyCart: string }>;
}

interface CartProps {
  cartID: '';
}

const CartContext = createContext({} as CartAttributesContext);

const useCart = (): CartAttributesContext => {
  return useContext(CartContext);
};

const CartProvider: FunctionComponent = ({ children }) => {
  const [cart, setCart] = useState<CartProps>({ cartID: '' });

  const createEmptyCartID = async (): Promise<{ createEmptyCart: string }> => {
    const cartID = await createEmptyCart();
    setCart({ ...cart, cartID });
    return cartID;
  };

  const cartContext: CartAttributesContext = {
    cart,
    createEmptyCartID,
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
};

export { CartProvider, useCart };
