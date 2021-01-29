# ESDoc Accessor Plugin

Use with updated [EnterTheNameHere/esdoc-monorepo](https://github.com/EnterTheNameHere/esdoc-monorepo).
Original esdoc is [here](https://github.com/esdoc/esdoc).

## Install
```bash
npm install @enterthenamehere/esdoc-accessor-plugin
```

## Config
```json
{
    "source": "./src",
    "destination": "./doc",
    "plugins": [
        {
            "name": "@enterthenamehere/esdoc-accessor-plugin",
            "option": {
                "access": [
                    "public",
                    "protected",
                    "private"],
                "autoPrivate": true
            }
        }
    ]
}
```

- `access` is default `["public", "protected", "private"]`
- `autoPrivate` is default `true`

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
