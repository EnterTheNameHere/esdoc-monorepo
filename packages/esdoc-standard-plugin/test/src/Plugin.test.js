const assert = require('assert');
const path = require('path');

describe('test standard plugin:', function () {
  it('dynamically load plugins', function () {
    const pluginEntries = require('../spy-plugin.js').pluginEntries;
    const actual = [];
    for( const pluginEntry of pluginEntries.values() ) {
      actual.push(pluginEntry.settings);
    };

    const expected = [
      {
        name: './src/Plugin.js',
        option: {
          brand: {
            title: 'My Library'
          },
          manual: {
            files: ['./test/manual/overview.md']
          },
          test: {
            source: "./test/test",
            includes: ["Test.js$"],
            excludes: ["\\.config\\.js$"],
            interfaces: ["describe", "it", "context", "suite", "test"]
          }
        }
      },
      {name: '@enterthenamehere/esdoc-lint-plugin', option: undefined},
      {name: '@enterthenamehere/esdoc-coverage-plugin', option: undefined},
      {name: '@enterthenamehere/esdoc-accessor-plugin', option: undefined},
      {name: '@enterthenamehere/esdoc-type-inference-plugin', option: undefined},
      {name: '@enterthenamehere/esdoc-external-ecmascript-plugin'},
      {name: '@enterthenamehere/esdoc-brand-plugin', option: {title: 'My Library'}},
      {name: '@enterthenamehere/esdoc-undocumented-identifier-plugin', option: undefined},
      {name: '@enterthenamehere/esdoc-unexported-identifier-plugin', option: undefined},
      {name: '@enterthenamehere/esdoc-integrate-manual-plugin', option: {
        files: ['./test/manual/overview.md'],
        //coverage: true
      }},
      {name: '@enterthenamehere/esdoc-integrate-test-plugin', option: {
        source: "./test/test",
        interfaces: ["describe", "it", "context", "suite", "test"],
        includes: ["Test.js$"],
        excludes: ["\\.config\\.js$"]
      }},
      {name: '@enterthenamehere/esdoc-publish-html-plugin'},
      {name: './test/spy-plugin.js'}
    ];

    assert.deepEqual(actual, expected);

  });
});
