const assert = require('assert');
const path = require('path');

describe('test standard plugin:', function () {
  it('dynamically load plugins', function () {
    const plugins = require('../spy-plugin.js').testTargetPlugins;

    assert.deepEqual(plugins, [
      {name: './src/Plugin.js', option: {
        brand: {
          title: 'My Library'
        },
        manual: {
          files: ['./test/manual/overview.md']
        },
        test: {
          source: "./test/test",
          includes: ["Test.js$"]
        }
      }},
      {name: './test/spy-plugin.js'},
      {name: '@enterthenamehere/esdoc-lint-plugin'},
      {name: '@enterthenamehere/esdoc-coverage-plugin'},
      {name: '@enterthenamehere/esdoc-accessor-plugin'},
      {name: '@enterthenamehere/esdoc-type-inference-plugin'},
      {name: '@enterthenamehere/esdoc-external-ecmascript-plugin'},
      {name: '@enterthenamehere/esdoc-brand-plugin', option: {title: 'My Library'}},
      {name: '@enterthenamehere/esdoc-undocumented-identifier-plugin'},
      {name: '@enterthenamehere/esdoc-unexported-identifier-plugin'},
      {name: '@enterthenamehere/esdoc-integrate-manual-plugin', option: {
        coverage: true,
        files: ['./test/manual/overview.md']
      }},
      {name: '@enterthenamehere/esdoc-integrate-test-plugin', option: {
        source: "./test/test",
        interfaces: ["describe", "it", "context", "suite", "test"],
        includes: ["Test.js$"],
        excludes: ["\\.config\\.js$"]
      }},
      {name: '@enterthenamehere/esdoc-publish-html-plugin'},
    ]);

  });
});
