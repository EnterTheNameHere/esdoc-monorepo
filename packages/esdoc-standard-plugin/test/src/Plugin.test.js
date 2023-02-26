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
            author: null,
            description: null,
            image: null,
            logo: null,
            repository: null,
            site: null,
            title: 'My Library',
          },
          manual: {
            asset: null,
            files: ['./test/manual/overview.md'],
            globalIndex: true,
            index: 'readme.md',
          },
          test: {
            source: './test/test',
            includes: ['Test.js$'],
            excludes: ['\\.config\\.js$'],
            interfaces: ['describe', 'it', 'context', 'suite', 'test']
          }
        }
      },
      {
        name: '@enterthenamehere/esdoc-lint-plugin',
        option: {
          enable: true
        }
      },
      {
        name: '@enterthenamehere/esdoc-coverage-plugin',
        option: {
          enable: true,
          kind: ['class', 'method', 'member', 'get', 'set', 'constructor', 'function', 'variable']
        }
      },
      {
        name: '@enterthenamehere/esdoc-accessor-plugin',
        option: {
          access: ['public', 'protected', 'private'],
          autoPrivate: true
        }
      },
      {
        name: '@enterthenamehere/esdoc-type-inference-plugin',
        option: {
          enable: true
        }
      },
      {
        name: '@enterthenamehere/esdoc-ecmascript-proposal-plugin',
        option: {
          all: true,
          asyncGenerators: true,
          classProperties: true,
          decorators: true,
          doExpressions: true,
          dynamicImport: true,
          exportExtensions: true,
          functionBind: true,
          functionSent: true,
          objectRestSpread: true,
        }
      },
      {
        name: '@enterthenamehere/esdoc-external-ecmascript-plugin',
        option: {
          enable: true
        }
      },
      {
        name: '@enterthenamehere/esdoc-brand-plugin',
        option: {
          author: null,
          description: null,
          image: null,
          logo: null,
          repository: null,
          site: null,
          title: 'My Library',
        }
      },
      {
        name: '@enterthenamehere/esdoc-undocumented-identifier-plugin',
        option: {
          enable: true
        }
      },
      {
        name: '@enterthenamehere/esdoc-integrate-manual-plugin',
        option: {
          asset: null,
          files: ['./test/manual/overview.md'],
          globalIndex: true,
          index: 'readme.md',
        }
      },
      {
        name: '@enterthenamehere/esdoc-integrate-test-plugin',
        option: {
          source: './test/test',
          includes: ['Test.js$'],
          excludes: ['\\.config\\.js$'],
          interfaces: ['describe', 'it', 'context', 'suite', 'test']
        }
      },
      {
        name: '@enterthenamehere/esdoc-publish-html-plugin',
        option: {
          template: null,
        }
      },
      {
        name: './test/spy-plugin.js',
        option: {}
      }
    ];
    
    assert.deepEqual(actual, expected);
  });
});
