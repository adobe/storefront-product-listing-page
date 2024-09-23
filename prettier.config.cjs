module.exports = {
    semi: true,
    trailingComma: "all",
    singleQuote: false,
    printWidth: 120,
    tabWidth: 4,
    overrides: [
        {
            files: "**/*.{yml,yaml}",
            options: {
                tabWidth: 2,
            },
        },
    ],
};
