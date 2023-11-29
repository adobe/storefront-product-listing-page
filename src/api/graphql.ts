import { CREATE_EMPTY_CART } from './mutations';

const graphqlEndpoint = `${window.origin}/graphql`;

const createEmptyCart = async () => {
  const response = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: CREATE_EMPTY_CART,
    }),
  });
  const results = await response.json();
  return results?.data;
};

export { createEmptyCart };
