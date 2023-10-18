const SimpleProduct = {
  productView: {
    __typename: 'SimpleProductView',
    sku: '24-WG088',
    name: 'Sprite Foam Roller',
    url: '',
    images: [
      {
        label: 'Image',
        url: '',
        roles: ['thumbnail'],
      },
    ],
    price: {
      final: {
        amount: {
          value: 19.0,
          currency: 'USD',
        },
      },
      regular: {
        amount: {
          value: 19.0,
          currency: 'USD',
        },
      },
    },
  },
  highlights: [
    {
      attribute: 'name',
      value: '<em>Sprite</em> Foam Roller',
      matched_words: [],
    },
  ],
};

const ComplexProduct = {
  productView: {
    __typename: 'ComplexProductView',
    sku: 'MSH06',
    name: 'Lono Yoga Short',
    url: '',
    images: [
      {
        label: '',
        url: '',
        roles: ['thumbnail'],
      },
      {
        label: '',
        url: '',
        roles: ['thumbnail'],
      },
      {
        label: '',
        url: '',
        roles: ['thumbnail'],
      },
    ],
    priceRange: {
      maximum: {
        final: {
          amount: {
            value: 32.0,
            currency: 'USD',
          },
        },
        regular: {
          amount: {
            value: 32.0,
            currency: 'USD',
          },
        },
      },
      minimum: {
        final: {
          amount: {
            value: 32.0,
            currency: 'USD',
          },
        },
        regular: {
          amount: {
            value: 32.0,
            currency: 'USD',
          },
        },
      },
    },
    options: [
      {
        id: 'size',
        title: 'Size',
        values: [
          {
            title: '32',
            id: 'Y29uZmlndXJhYmxlLzE4Ni8xODQ=',
            type: 'TEXT',
            value: '32',
          },
          {
            title: '33',
            id: 'Y29uZmlndXJhYmxlLzE4Ni8xODU=',
            type: 'TEXT',
            value: '33',
          },
          {
            title: '34',
            id: 'Y29uZmlndXJhYmxlLzE4Ni8xODY=',
            type: 'TEXT',
            value: '34',
          },
          {
            title: '36',
            id: 'Y29uZmlndXJhYmxlLzE4Ni8xODc=',
            type: 'TEXT',
            value: '36',
          },
        ],
      },
      {
        id: 'color',
        title: 'Color',
        values: [
          {
            title: 'Blue',
            id: 'Y29uZmlndXJhYmxlLzkzLzU5',
            type: 'COLOR_HEX',
            value: '#1857f7',
          },
          {
            title: 'Red',
            id: 'Y29uZmlndXJhYmxlLzkzLzY3',
            type: 'COLOR_HEX',
            value: '#ff0000',
          },
          {
            title: 'Gray',
            id: 'Y29uZmlndXJhYmxlLzkzLzYx',
            type: 'COLOR_HEX',
            value: '#8f8f8f',
          },
        ],
      },
    ],
  },
  highlights: [
    {
      attribute: 'name',
      value: 'Lono <em>Yoga</em> Short',
      matched_words: [],
    },
  ],
};

export const products = [
  SimpleProduct,
  SimpleProduct,
  SimpleProduct,
  SimpleProduct,
  SimpleProduct,
  SimpleProduct,
  ComplexProduct,
];
