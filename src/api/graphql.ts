const graphqlEndpoint = `${window.origin}/graphql`;

async function getGraphQL(query = '', variables = {}, store = '') {
  const response = await fetch(graphqlEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Store: store },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((res) => res.json());

  return response;
}

export { getGraphQL };
