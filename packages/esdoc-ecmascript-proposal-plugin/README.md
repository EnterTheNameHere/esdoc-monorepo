# ESDoc ECMAScript Proposal Plugin

Use with updated [EnterTheNameHere/esdoc-monorepo](https://github.com/EnterTheNameHere/esdoc-monorepo).
Original esdoc is [here](https://github.com/esdoc/esdoc).

## Install
```
npm install @enterthenamehere/esdoc-ecmascript-proposal-plugin
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {"name": "@enterthenamehere/esdoc-ecmascript-proposal-plugin", "option": {"all": true}}
  ]
}
```

If you want to enable each proposals,
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {
      "name": "esdoc-ecmascript-proposal-plugin",
      "option": {
        "classProperties": true,
        "objectRestSpread": true,
        "doExpressions": true,
        "functionBind": true,
        "functionSent": true,
        "asyncGenerators": true,
        "decorators": true,
        "exportExtensions": true,
        "dynamicImport": true
      }
    }
  ]
}
```

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
