# storefront-product-listing-page

Product Listing Page for Adobe Commerce Storefronts

Repo containing the Live Search PLP

## Running locally

#### Storybook

```
yarn storybook
```

#### Example

```
yarn dev
```

And open `localhost:8080/v1/index.html` in your favorite browser.

## Design System

Internally we use Tailwind to style our components. Here's a good read up if you are keen: [Tailwind Docs](https://tailwindcss.com/docs/utility-first)

Externally developers will use CSS variables and CSS classes we expose to create a custom brand for their storefront. Developers will target CSS variables to adjust generic values that are used across our widget, like line height, spacing, primary and secondary colors. CSS classes will be used to target specific components or elements of components for a more granular approach. In short, CSS variables can create a general theme and CSS classes can target specific elements in our widget.

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

Some helpful tools when developing in this monorepo:

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
yarn dev:coverage
```

Headless:

```
yarn test:e2e:headless
```

Interactive:

```
yarn test:e2e
```
