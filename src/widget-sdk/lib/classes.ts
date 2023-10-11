/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

export const classes = (
  classes: Array<string | [string, boolean] | undefined>
) => {
  const result = classes.reduce((result, item) => {
    if (!item) return result;

    if (typeof item === 'string') result += ` ${item}`;

    if (Array.isArray(item)) {
      const [className, isActive] = item;
      if (className && isActive) {
        result += ` ${className}`;
      }
    }

    return result;
  }, '') as string;

  return result.trim();
};
