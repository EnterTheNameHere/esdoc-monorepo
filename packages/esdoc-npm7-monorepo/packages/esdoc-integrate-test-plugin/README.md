# ESDoc Integrate Test Plugin

Use with updated [EnterTheNameHere/esdoc-monorepo](https://github.com/EnterTheNameHere/esdoc-monorepo).
Original esdoc is [here](https://github.com/esdoc/esdoc).

## Install
```bash
npm install @enterthenamehere/esdoc-integrate-test-plugin
```

## Config
```json
{
  "source": "./src",
  "destination": "./docs",
  "plugins": [
    {
      "name": "@enterthenamehere/esdoc-integrate-test-plugin",
      "option": {
        "source": "./test/",
        "interfaces": ["describe", "it", "context", "suite", "test"],
        "includes": ["(spec|Spec|test|Test)\\.js$"],
        "excludes": ["\\.config\\.js$"]
      }
    }
  ]
}
```

- `source` is required
- `interfaces` default is `["describe", "it", "context", "suite", "test"]`
- `includes` default is `["(spec|Spec|test|Test)\\.js$"]`
- `excludes` default is `["\\.config\\.js$"]`

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
