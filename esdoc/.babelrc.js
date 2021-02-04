
module.exports = {
    presets: [
        [
            "@babel/preset-env", {
            targets: {
              node: "current",
              esmodules: true,
            },
        }]
    ],
    ignore: [ "test" ],
    sourceMaps: "inline",
    plugins: [ "@babel/plugin-transform-modules-commonjs" ],
    env: {
        coverage: {
            plugins: [ "istanbul" ]
        }
    }
};
