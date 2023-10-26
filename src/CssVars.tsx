/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

import { Fragment } from 'preact';
import { useState } from 'preact/hooks';

import { setCssVariables } from './utils/setCssVariable';

export const CssVars = () => {
  const [primary, setPrimary] = useState<string>('#000');
  const [sizeSm, setSizeSm] = useState<string>('0.625rem');

  return (
    <Fragment>
      <div>
        <label
          htmlFor="Primary"
          className="block text-sm font-medium text-gray-50"
        >
          Primary Color
        </label>
        <div className="mt-1">
          <input
            name="primary"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="#000"
            onInput={(e) => setPrimary(e.currentTarget.value)}
          />
        </div>
      </div>

      <button
        onClick={() =>
          setCssVariables({
            variableName: '--color-primary',
            value: primary,
          })
        }
      >
        Set Primary Color
      </button>
      <div>
        <label
          htmlFor="size-sm"
          className="block text-sm font-medium text-primary"
        >
          Size Sm
        </label>
        <div className="mt-1">
          <input
            name="size-sm"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="0.625rem"
            onInput={(e) => setSizeSm(e.currentTarget.value)}
          />
        </div>
      </div>

      <button
        onClick={() =>
          setCssVariables({
            variableName: '--font-sm',
            value: sizeSm,
          })
        }
      >
        Set Set Size Small
      </button>
    </Fragment>
  );
};
