
module.exports = {
    presets: [
        [
            "@babel/preset-env", {
            targets: {
              node: "10",
              esmodules: true,
            },
        }]
    ],
    ignore: [ "test" ],
    sourceMaps: "inline",
    plugins: [
        "@babel/plugin-transform-modules-commonjs",
        "@babel/plugin-proposal-class-properties",
    ],
    env: {
        coverage: {
            plugins: [ "istanbul" ]
        }
    }
};
