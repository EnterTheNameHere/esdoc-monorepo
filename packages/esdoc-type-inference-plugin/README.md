# ESDoc Type Inference Plugin(PoC)

Use with updated [EnterTheNameHere/esdoc-monorepo](https://github.com/EnterTheNameHere/esdoc-monorepo).
Original esdoc is [here](https://github.com/esdoc/esdoc).

**This is Proof of Concept**
## Install
```bash
npm install @enterthenamehere/esdoc-type-inference-plugin
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {"name": "@enterthenamehere/esdoc-type-inference-plugin", "option": {"enable": true}}
  ]
}
```

- `enable` is default `true`

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
