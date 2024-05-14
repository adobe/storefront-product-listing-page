# storefront-product-listing-page

## Product Listing Page for Adobe Commerce Storefronts using Live Search
The product listing page provides coverage for both search and browse (PLP) results and includes the faceting, sorting, and product card areas on the page. This is the recommended default storefront PLP provided by Live Search. It provides a search experience that is client side rendered and hosted with a decoupled architecture.

The PLP calls the catalog service which extends the Live Search productSearch query to return product view data. This allows the PLP to render additional product attributes like swatches with a single call.

Learn more:

- Live Search https://experienceleague.adobe.com/docs/commerce-merchant-services/live-search/guide-overview.html?lang=en
- PLP https://experienceleague.adobe.com/docs/commerce-merchant-services/live-search/live-search-storefront/plp-styling.html?lang=en
- Catalog Service https://developer.adobe.com/commerce/webapi/graphql/schema/catalog-service/


## Repo containing the Live Search PLP
This repo is available as a reference implementation *only*, customizations are *not supported*, and subject to change.

Best practices include:
- forking this repo
- periodically rebasing with develop

## Setup

#### Install dependencies

```
npm install
```

#### Storybook

```
npm run storybook
```

#### Local Development

```
npm run dev
```

And open `localhost:8080/v2/index.html` in your favorite browser.

### Unit Testing

```
npm run test
```

### Build
```
npm run build
```

search.js will be built to ./dist/

## Example setup:

import the script:

```
<script type="text/javascript" src="search.js"></script>
```

### Setup the Store Details:

Most of these will be passed with the extension if you have your storefront setup. The SANDBOX_KEY (api key for the sandbox env) is the only key that will need to be set within webpack.

#### Store Variables needed:
```
      ENVIRONMENT_ID 
      WEBSITE_CODE 
      STORE_CODE 
      STORE_VIEW_CODE 
      CUSTOMER_GROUP_CODE 
      API_KEY 
      SANDBOX_KEY // input this key into webpack.dev.js & webpack.prod.js
```
- To set up sandbox keys please see here: https://experienceleague.adobe.com/docs/commerce-merchant-services/catalog-service/installation.html?lang=en

#### insert into store details config

```
const storeDetails = {
      environmentId: 'ENVIRONMENT_ID',
      websiteCode: 'WEBSITE_CODE',
      storeCode: 'STORE_CODE',
      storeViewCode: 'STORE_VIEW_CODE',
      config: {
        minQueryLength: '2',
        pageSize: 8,
        perPageConfig: {
          pageSizeOptions: '12,24,36',
          defaultPageSizeOption: '24',
        },
        currencySymbol: '$',
        currencyRate: '1',
        displaySearchBox: true,
        displayOutOfStock: true,
        allowAllProducts: false,
      },
      context: {
        customerGroup: 'CUSTOMER_GROUP_CODE',
      },
      apiKey: 'API_KEY',
    };
```

Append LiveSearchPLP to the storefront window:

```
const root = document.querySelector('div.search-plp-root');

setTimeout(async () => {
      while (typeof window.LiveSearchPLP !== 'function') {
        console.log('waiting for window.LiveSearchPLP to be available');
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      window.LiveSearchPLP({ storeDetails, root });
}, 1000);
```

You can see the example in [dev-template.html](./dev-template.html)


### Theming and Styling

We use Tailwind to style/theme our components. Here's a good read up if you are keen: [Tailwind Docs](https://tailwindcss.com/docs/utility-first)

In addition to this themeing, we have CSS classes where storefronts can target and customize specific components of the widget. CSS classes will be used to target specific components or elements of components for a more granular approach. In short, CSS variables can create a general theme and CSS classes can target specific elements in our widget.

With Tailwind we do not write custom CSS. Instead, we use its utility classes that are generated at buildtime using a config we provide and scanning our markup (this way we don't have extra CSS we don't need). This is our [config file](./tailwind.config.js).

So how do we use CSS variables to style our components? Great question 😄

Let's say as if I want to style an element with the theme's primary color. Normally, in CSS we would have done the following:

```
<style>
 .primaryColor {
    color: var(--primary-color)
 }
</style>

<div class="primaryColor">
  Yippee I am a primary color!
</div>
```

Using Tailwind the following produces the exact same result:

```
<div class="text-primary">
  Yippee I am a primary color!
</div>

```

Looking at the config file you will notice that the CSS variable is `--color-primary` is mapped to the Tailwind CSS theme color key `primary`. this means anywhere in Tailwind you would use a Color key in a class you can now use the word `primary`.

You can add your own variables to [tokens.css](./src/styles/tokens.css). Furthermore, you can define your own tailwind classes using these variables in the [config file](./tailwind.config.js).

### Have tailwind only apply to the nested widget

Follow the [tailwind nesting documentation](https://tailwindcss.com/docs/using-with-preprocessors#nesting). Your [postcss.config](./postcss.config.js) will look like this:

```
module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('autoprefixer'),
    require('tailwindcss'),
    require('cssnano'),
  ],
};
```

From there you should be able to nest the tailwind classes:

```
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
```

within `.ds-widgets` in [token.css](./src/styles/tokens.css)

```
.ds-widgets {
  @import 'tailwindcss/base';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';

  ...
}
```

Some helpful tools when developing with tailwind:

- [Tailwind CSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)


## Feature flags

We use [sophia](https://sophia.corp.adobe.com/sophia/) to hide soon to release features behind feature flags.

### Config variables

`FLOODGATE_CLIENT_ID` - has to be one of:

`ds-live-search-mfe-dev`
`ds-live-search-mfe-qa`
`ds-live-search-mfe-prod`

`FLOODGATE_API_KEY` - `ds-live-search-mfe`, shared across all three LS MFE client IDs.

Optional enviroment variable for turning on feature flags for a specific client (not currently used):
`root.attribute(floodgate-environment-id)`

### Supported feature flags

none yet - `test` feature flag in `ds-live-search-mfe-dev` for testing and demo purposes

### Implementing features behind feature flags

(1) in [sophia](https://sophia.corp.adobe.com/sophia/), create new feature flag (`test` in `dev` can be used as an example)
(2) in your code, fetch value of the new flag by calling `useFeatureFlags()` and wrap feature code with an `if({flag})`

Example - using the `test` flag to disable pagination in Pagination.tsx:

```js
// ... other code code

import { useFloodgateFlags } from 'src/utils/Floodgate';

// ...

export const Pagination: FunctionComponent<PaginationProps> = ({
  // ...
}) => {
  const flags = useFloodgateFlags();
  if (flags?.test) {
    return <div></div>
  }
  // ... other code
```

(3) you can test your change by turning the flag on and off in [sophia](https://sophia.corp.adobe.com/sophia/)

### More feature flags info

Adobe I/O keys for LS MFEs (needed for Floodgate whitelisting) [here](https://admin.adobe.io/consumer/org/236421/apps/389687).

Additional documentation on adding new applications and feature flags [here](https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=ACDS&title=Floodgate+Integration).

## Testing

### Unit Testing

A good refresher on how to test: https://xp123.com/articles/3a-arrange-act-assert/

### UI Tests

```
npm run dev:coverage
```

Headless:

```
npm run test:e2e:headless
```

Interactive:

```
npm run test:e2e
```
