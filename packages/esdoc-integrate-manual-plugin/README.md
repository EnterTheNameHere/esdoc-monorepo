# ESDoc Integrate Manual Plugin

Use with updated [EnterTheNameHere/esdoc-monorepo](https://github.com/EnterTheNameHere/esdoc-monorepo).
Original esdoc is [here](https://github.com/esdoc/esdoc).

## Install
```bash
npm install @enterthenamehere/esdoc-integrate-manual-plugin
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {
      "name": "@enterthenamehere/esdoc-integrate-manual-plugin",
      "option": {
        "index": "./manual/index.md",
        "globalIndex": false,
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
      }
    }
  ]
}
```

`index` is default `readme.md`
`globalIndex` is default `false`
`asset` is default `null` - can be directory to copy
`files` is default `[]` - array of files making manual pages

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
