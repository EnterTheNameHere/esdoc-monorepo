# ESDoc Standard Plugin

Use with updated [EnterTheNameHere/esdoc-monorepo](https://github.com/EnterTheNameHere/esdoc-monorepo).
Original esdoc is [here](https://github.com/esdoc/esdoc).

## Install
```
npm install @enterthenamehere/esdoc-standard-plugin
```

Original plugins can be found [here](https://github.com/esdoc/esdoc-plugins).

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {
      "name": "@enterthenamehere/esdoc-standard-plugin",
      "option": {
        "lint": {"enable": true},
        "coverage": {"enable": true},
        "accessor": {"access": ["public", "protected", "private"], "autoPrivate": true},
        "undocumentIdentifier": {"enable": true},
        "unexportedIdentifier": {"enable": false},
        "typeInference": {"enable": true},
        "brand": {
          "logo": "./logo.png",
          "title": "My Library",
          "description": "this is awesome library",
          "repository": "https://github.com/foo/bar",
          "site": "http://my-library.org",
          "author": "https://twitter.com/foo",
          "image": "http://my-library.org/logo.png"
        },
        "manual": {
          "index": "./manual/index.md",
          "globalIndex": true,
          "asset": "./manual/asset",
          "files": [
            "./manual/overview.md",
            "./manual/design.md",
            "./manual/installation.md",
            "./manual/usage1.md",
            "./manual/usage2.md",
            "./manual/tutorial.md",
            "./manual/configuration.md",
            "./manual/example.md",
            "./manual/advanced.md",
            "./manual/faq.md",
            "./CHANGELOG.md"
          ]
        },
        "test": {
          "source": "./test/",
          "interfaces": ["describe", "it", "context", "suite", "test"],
          "includes": ["(spec|Spec|test|Test)\\.js$"],
          "excludes": ["\\.config\\.js$"]
        }
      }
    }
  ]
}
```

The `esdoc-standard-plugin` is a glue plugin. The following plugins are used by this.
- [@enterthenamehere/esdoc-lint-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/plugins/esdoc-lint-plugin)
- [@enterthenamehere/esdoc-coverage-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/plugins/esdoc-coverage-plugin)
- [@enterthenamehere/esdoc-accessor-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/plugins/esdoc-accessor-plugin)
- [@enterthenamehere/esdoc-type-inference-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/plugins/esdoc-type-inference-plugin)
- [@enterthenamehere/esdoc-external-ecmascript-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/plugins/esdoc-external-ecmascript-plugin)
- [@enterthenamehere/esdoc-brand-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/plugins/esdoc-brand-plugin)
- [@enterthenamehere/esdoc-undocumented-identifier-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/plugins/esdoc-undocumented-identifier-plugin)
- [@enterthenamehere/esdoc-unexported-identifier-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/plugins/esdoc-unexported-identifier-plugin)
- [@enterthenamehere/esdoc-integrate-manual-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/plugins/esdoc-integrate-manual-plugin)
- [@enterthenamehere/esdoc-integrate-test-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/plugins/esdoc-integrate-test-plugin)
- [@enterthenamehere/esdoc-publish-html-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/plugins/esdoc-publish-html-plugin)
- [@enterthenamehere/esdoc-ecmascript-proposal-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/plugins/esdoc-ecmascript-proposal-plugin)

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
