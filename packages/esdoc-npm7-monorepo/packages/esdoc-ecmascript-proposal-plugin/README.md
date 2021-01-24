# ESDoc ECMAScript Proposal Plugin
## Install
```
npm install https://github.com/EnterTheNameHere/esdoc-ecmascript-proposal-plugin.git
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {"name": "esdoc-ecmascript-proposal-plugin", "option": {"all": true}}
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
