const plugins = ["babel-plugin-istanbul"];

module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                useBuiltIns: "usage", // alternative mode: "entry"
                corejs: 3, // default would be 2
                targets: "> 0.25%, not dead",
                // set your own target environment here (see Browserslist)
            },
        ],
        "@babel/typescript",
        [
            "@babel/preset-react",
            {
                development: true,
            },
        ],
    ],
    plugins,
    babelrc: false,
};
