/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

export const framework = {
  name: '@storybook/preact-webpack5',
  options: {},
};

export const addons = [
  '@storybook/addon-essentials',
  '@storybook/addon-a11y',
  '../config/storybook/addon',
  '../storybook-stories',
];
