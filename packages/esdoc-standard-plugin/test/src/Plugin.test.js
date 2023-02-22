const assert = require('assert');

describe('test standard plugin:', function () {
  it('dynamically load plugins', function () {
    const pluginEntries = require('../spy-plugin.js').pluginEntries;
    const actual = [];
    for( const pluginEntry of pluginEntries.values() ) {
      actual.push({name: pluginEntry.name, option: pluginEntry.pluginOptions});
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
      {name: '@enterthenamehere/esdoc-lint-plugin', option: {enable: true}},
      {name: '@enterthenamehere/esdoc-coverage-plugin', option: {enable: true, kind: ['class', 'method', 'member', 'get', 'set', 'constructor', 'function', 'variable']}},
      {name: '@enterthenamehere/esdoc-accessor-plugin', option: {access: ['public', 'protected', 'private'], autoPrivate: true}},
      {name: '@enterthenamehere/esdoc-type-inference-plugin', option: {enable: true}},
      {name: '@enterthenamehere/esdoc-ecmascript-proposal-plugin', option: {}},
      {name: '@enterthenamehere/esdoc-external-ecmascript-plugin', option: {enable: true}},
      {name: '@enterthenamehere/esdoc-brand-plugin', option: {title: 'My Library'}},
      {name: '@enterthenamehere/esdoc-undocumented-identifier-plugin', option: {enable: true}},
      {name: '@enterthenamehere/esdoc-unexported-identifier-plugin', option: {enable: false}},
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
      {name: '@enterthenamehere/esdoc-publish-html-plugin', option: {}},
      {name: './test/spy-plugin.js', option: {}}
    ];
    
    assert.deepEqual(actual, expected);

  });
});
