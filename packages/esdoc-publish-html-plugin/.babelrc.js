
module.exports = {
    presets: [
        [ "@babel/preset-env", {
            targets: {
                node: "10",
                esmodules: true
            },
        }],
    ],
    sourceMaps: "inline",
    plugins: ["@babel/plugin-transform-modules-commonjs", "istanbul"],
};
