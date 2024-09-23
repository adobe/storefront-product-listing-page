// module.exports = {
//   plugins: [
//     require('postcss-import'),
//     require('tailwindcss/nesting'),
//     require('autoprefixer'),
//     require('tailwindcss'),
//     require('cssnano'),
//   ],
// };
export default {
    plugins: {
        "postcss-import": {},
        "tailwindcss/nesting": {},
        tailwindcss: {},
        autoprefixer: {},
        cssnano: {},
    },
};
