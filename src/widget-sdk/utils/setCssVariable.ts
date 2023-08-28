type SetCssVariablesProps = {
    variableName: string;
    value: string;
};
export const setCssVariables = ({
    variableName,
    value,
}: SetCssVariablesProps) => {
    const widgetContainer = document.querySelector(
        ".ds-widgets",
    ) as HTMLElement;

    widgetContainer?.style.setProperty(variableName, value);
};
