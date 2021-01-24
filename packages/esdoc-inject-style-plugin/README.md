# ESDoc Inject Style Plugin
## Install
```bash
npm install https://github.com/EnterTheNameHere/esdoc-inject-style-plugin.git
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {"name": "esdoc-inject-style-plugin", "option": {"enable": true, "styles": ["./foo.css"]}}
  ]
}
```

`enable` is default `true`.

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
