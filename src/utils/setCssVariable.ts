/*
Copyright 2024 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

type SetCssVariablesProps = {
  variableName: string;
  value: string;
};
export const setCssVariables = ({
  variableName,
  value,
}: SetCssVariablesProps) => {
  const widgetContainer = document.querySelector('.ds-widgets') as HTMLElement;

  widgetContainer?.style.setProperty(variableName, value);
};
