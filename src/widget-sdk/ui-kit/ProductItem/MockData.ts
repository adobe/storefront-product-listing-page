import { Product } from '../../../types/interface';

export const sampleProductNoImage: Product = {
  productView: {
    __typename: 'SimpleProduct',
    id: 21,
    uid: '21',
    name: 'Sprite Foam Yoga Brick',
    sku: '24-WG084',
    description: {
      html: '<p>Our top-selling yoga prop, the 4-inch, high-quality Sprite Foam Yoga Brick is popular among yoga novices and studio professionals alike. An essential yoga accessory, the yoga brick is a critical tool for finding balance and alignment in many common yoga poses. Choose from 5 color options.</p>\n<ul>\n<li>Standard Large Size: 4" x 6" x 9".\n<li>Beveled edges for ideal contour grip.\n<li>Durable and soft, scratch-proof foam.\n<li>Individually wrapped.\n<li>Ten color choices.\n</ul> ',
    },
    short_description: null,
    attribute_set_id: null,
    meta_title: null,
    meta_keyword: null,
    meta_description: null,
    images: null,
    new_from_date: null,
    new_to_date: null,
    created_at: null,
    updated_at: null,
    price: {
      final: {
        amount: {
          value: 5,
          currency: 'USD',
        },
        adjustments: null,
      },
      regular: {
        amount: {
          value: 5,
          currency: 'USD',
        },
        adjustments: null,
      },
    },
    priceRange: {
      maximum: {
        final: {
          amount: {
            value: 5,
            currency: 'USD',
          },
          adjustments: null,
        },
        regular: {
          amount: {
            value: 5,
            currency: 'USD',
          },
          adjustments: null,
        },
      },
      minimum: {
        final: {
          amount: {
            value: 5,
            currency: 'USD',
          },
          adjustments: null,
        },
        regular: {
          amount: {
            value: 8,
            currency: 'USD',
          },
          adjustments: null,
        },
      },
    },
    gift_message_available: null,
    url: '',
    media_gallery: null,
    custom_attributes: null,
    add_to_cart_allowed: null,
    options: null,
  },
  highlights: [
    {
      attribute: 'name',
      value: 'Sprite Foam <em>Yoga</em> Brick',
      matched_words: [],
    },
    {
      attribute: 'description',
      value:
        '<p>Our top-selling <em>yoga</em> prop, the 4-inch, high-quality Sprite Foam <em>Yoga</em> Brick is popular among <em>yoga</em> novices and studio professionals alike. An essential <em>yoga</em> accessory, the <em>yoga</em> brick is a critical tool for finding balance and alignment in many common <em>yoga</em> poses. Choose from 5 color options.</p>\n<ul>\n<li>Standard Large Size: 4" x 6" x 9".\n<li>Beveled edges for ideal contour grip.\n<li>Durable and soft, scratch-proof foam.\n<li>Individually wrapped.\n<li>Ten color choices.\n</ul>',
      matched_words: [],
    },
  ],
};

export const sampleProductDiscounted: Product = {
  productView: {
    __typename: 'SimpleProduct',
    id: 21,
    uid: '21',
    name: 'Sprite Foam Yoga Brick',
    sku: '24-WG084',
    description: {
      html: '<p>Our top-selling yoga prop, the 4-inch, high-quality Sprite Foam Yoga Brick is popular among yoga novices and studio professionals alike. An essential yoga accessory, the yoga brick is a critical tool for finding balance and alignment in many common yoga poses. Choose from 5 color options.</p>\n<ul>\n<li>Standard Large Size: 4" x 6" x 9".\n<li>Beveled edges for ideal contour grip.\n<li>Durable and soft, scratch-proof foam.\n<li>Individually wrapped.\n<li>Ten color choices.\n</ul> ',
    },
    short_description: null,
    attribute_set_id: null,
    meta_title: null,
    meta_keyword: null,
    meta_description: null,
    images: [
      {
        url: '',
        label: null,
        position: null,
        disabled: null,
        roles: ['thumbnail'],
      },
      {
        url: '',
        label: null,
        position: null,
        disabled: null,
        roles: ['thumbnail'],
      },
      {
        url: '',
        label: null,
        position: null,
        disabled: null,
        roles: ['thumbnail'],
      },
    ],
    new_from_date: null,
    new_to_date: null,
    created_at: null,
    updated_at: null,
    price: {
      final: {
        amount: {
          value: 5,
          currency: 'USD',
        },
        adjustments: null,
      },
      regular: {
        amount: {
          value: 5,
          currency: 'USD',
        },
        adjustments: null,
      },
    },
    priceRange: {
      maximum: {
        final: {
          amount: {
            value: 5,
            currency: 'USD',
          },
          adjustments: null,
        },
        regular: {
          amount: {
            value: 5,
            currency: 'USD',
          },
          adjustments: null,
        },
      },
      minimum: {
        final: {
          amount: {
            value: 5,
            currency: 'USD',
          },
          adjustments: null,
        },
        regular: {
          amount: {
            value: 8,
            currency: 'USD',
          },
          adjustments: null,
        },
      },
    },
    gift_message_available: null,
    url: '',
    media_gallery: null,
    custom_attributes: null,
    add_to_cart_allowed: null,
    options: null,
  },
  highlights: [
    {
      attribute: 'name',
      value: 'Sprite Foam <em>Yoga</em> Brick',
      matched_words: [],
    },
    {
      attribute: 'description',
      value:
        '<p>Our top-selling <em>yoga</em> prop, the 4-inch, high-quality Sprite Foam <em>Yoga</em> Brick is popular among <em>yoga</em> novices and studio professionals alike. An essential <em>yoga</em> accessory, the <em>yoga</em> brick is a critical tool for finding balance and alignment in many common <em>yoga</em> poses. Choose from 5 color options.</p>\n<ul>\n<li>Standard Large Size: 4" x 6" x 9".\n<li>Beveled edges for ideal contour grip.\n<li>Durable and soft, scratch-proof foam.\n<li>Individually wrapped.\n<li>Ten color choices.\n</ul>',
      matched_words: [],
    },
  ],
};

export const sampleProductNotDiscounted: Product = {
  productView: {
    __typename: 'SimpleProduct',
    id: 21,
    uid: '21',
    name: 'Sprite Foam Yoga Brick',
    sku: '24-WG084',
    description: {
      html: '<p>Our top-selling yoga prop, the 4-inch, high-quality Sprite Foam Yoga Brick is popular among yoga novices and studio professionals alike. An essential yoga accessory, the yoga brick is a critical tool for finding balance and alignment in many common yoga poses. Choose from 5 color options.</p>\n<ul>\n<li>Standard Large Size: 4" x 6" x 9".\n<li>Beveled edges for ideal contour grip.\n<li>Durable and soft, scratch-proof foam.\n<li>Individually wrapped.\n<li>Ten color choices.\n</ul> ',
    },
    short_description: null,
    attribute_set_id: null,
    meta_title: null,
    meta_keyword: null,
    meta_description: null,
    images: [
      {
        url: '',
        label: null,
        position: null,
        disabled: null,
        roles: ['thumbnail'],
      },
      {
        url: '',
        label: null,
        position: null,
        disabled: null,
        roles: ['thumbnail'],
      },
      {
        url: '',
        label: null,
        position: null,
        disabled: null,
        roles: ['thumbnail'],
      },
    ],
    new_from_date: null,
    new_to_date: null,
    created_at: null,
    updated_at: null,
    price: {
      final: {
        amount: {
          value: 8,
          currency: 'USD',
        },
        adjustments: null,
      },
      regular: {
        amount: {
          value: 8,
          currency: 'USD',
        },
        adjustments: null,
      },
    },
    priceRange: {
      maximum: {
        final: {
          amount: {
            value: 8,
            currency: 'USD',
          },
          adjustments: null,
        },
        regular: {
          amount: {
            value: 8,
            currency: 'USD',
          },
          adjustments: null,
        },
      },
      minimum: {
        final: {
          amount: {
            value: 8,
            currency: 'USD',
          },
          adjustments: null,
        },
        regular: {
          amount: {
            value: 8,
            currency: 'USD',
          },
          adjustments: null,
        },
      },
    },
    gift_message_available: null,
    url: '',
    media_gallery: null,
    custom_attributes: null,
    add_to_cart_allowed: null,
    options: null,
  },
  highlights: [
    {
      attribute: 'name',
      value: 'Sprite Foam <em>Yoga</em> Brick',
      matched_words: [],
    },
    {
      attribute: 'description',
      value:
        '<p>Our top-selling <em>yoga</em> prop, the 4-inch, high-quality Sprite Foam <em>Yoga</em> Brick is popular among <em>yoga</em> novices and studio professionals alike. An essential <em>yoga</em> accessory, the <em>yoga</em> brick is a critical tool for finding balance and alignment in many common <em>yoga</em> poses. Choose from 5 color options.</p>\n<ul>\n<li>Standard Large Size: 4" x 6" x 9".\n<li>Beveled edges for ideal contour grip.\n<li>Durable and soft, scratch-proof foam.\n<li>Individually wrapped.\n<li>Ten color choices.\n</ul>',
      matched_words: [],
    },
  ],
};
