export const classes = (
    classes: Array<string | [string, boolean] | undefined>,
) => {
    const result = classes.reduce((result, item) => {
        if (!item) return result;

        if (typeof item === "string") result += ` ${item}`;

        if (Array.isArray(item)) {
            const [className, isActive] = item;
            if (className && isActive) {
                result += ` ${className}`;
            }
        }

        return result;
    }, "") as string;

    return result.trim();
};
