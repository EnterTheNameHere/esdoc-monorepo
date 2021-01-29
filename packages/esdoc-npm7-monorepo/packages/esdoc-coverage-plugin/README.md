# ESDoc Coverage Plugin

Use with updated [EnterTheNameHere/esdoc-monorepo](https://github.com/EnterTheNameHere/esdoc-monorepo).
Original esdoc is [here](https://github.com/esdoc/esdoc).

## Install
```
npm install @enterthenamehere/esdoc-coverage-plugin
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {
      "name": "@enterthenamehere/esdoc-coverage-plugin",
      "option": {
        "enable": true,
        "kind": ["class", "method", "member", "get", "set", "constructor", "function", "variable"]
      }
    }
  ]
}
```

`enable` is default `true`.

`kind` is default `["class", "method", "member", "get", "set", "constructor", "function", "variable"]`.

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
