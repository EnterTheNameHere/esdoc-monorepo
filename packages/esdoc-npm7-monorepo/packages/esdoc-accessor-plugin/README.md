# ESDoc Accessor Plugin
## Install
```bash
npm install https://github.com/EnterTheNameHere/esdoc-accessor-plugin.git
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {"name": "esdoc-accessor-plugin", "option": {"access": ["public", "protected", "private"], "autoPrivate": true}}
  ]
}
```

- `access` is default `["public", "protected", "private"]`
- `autoPrivate` is default `true`

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
