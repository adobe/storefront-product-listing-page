module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            pragma: "h",
            version: "detect",
        },
    },
    env: {
        node: true,
        browser: true,
        es6: true,
    },
    globals: {
        document: true,
        window: true,
        API_URL: true,
        WIDGET_CONFIG_URL: true,
        API_KEY: true,
        SANDBOX_KEY: true,
        TEST_URL: true,
    },
    extends: [
        // "eslint:recommended",
        "plugin:preact/recommended",
        "plugin:@typescript-eslint/recommended",
        // "plugin:@typescript-eslint/eslint-recommended",
        // "preact",
        "plugin:storybook/recommended",
        "plugin:prettier/recommended", // should always be last
    ],
    plugins: ["jest", "simple-import-sort", "@typescript-eslint"],
    rules: {
        "no-console": ["error"],
        "react/prop-types": 0,
        "@typescript-eslint/default-param-last": ["error"],
        "@typescript-eslint/no-explicit-any": ["off"],
        "simple-import-sort/imports": [
            "error",
            {
                groups: [
                    // Packages.
                    // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
                    ["^@?\\w"],
                    // Absolute imports and other imports such as Vue-style `@/foo`.
                    // Anything that does not start with a dot.
                    ["^[^.]"],
                    // Side effect imports.
                    ["^\\u0000"],
                    // Relative imports.
                    // Anything that starts with a dot.
                    ["^\\."],
                ],
            },
        ],
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                vars: "local",
                varsIgnorePattern: "",
            },
        ],
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/ban-ts-comment": ["error", { "ts-ignore": "allow-with-description" }],
    },
    overrides: [
        {
            files: ["*.js"],
            rules: {
                "@typescript-eslint/no-var-requires": "off",
            },
        },
    ],
    ignorePatterns: [
        "node_modules",
        "dist", 
        "config",
        "**/*.test.ts",
        "**/*.test.tsx"
    ],
};
