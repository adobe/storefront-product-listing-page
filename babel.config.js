module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                modules: false,
                targets: {
                    browsers: ["last 2 versions"],
                },
            },
        ],
        ["@babel/preset-typescript", { jsxPragma: "h" }],
    ],
    plugins: [
        ["babel-plugin-tsconfig-paths"],
        [
            "@babel/plugin-transform-react-jsx",
            {
                runtime: "automatic",
                importSource: "preact",
            },
        ],
    ],
    env: {
        test: {
            plugins: ["dynamic-import-node", "istanbul"],
        },
    },
};
