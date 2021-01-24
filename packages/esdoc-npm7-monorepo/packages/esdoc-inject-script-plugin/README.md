# ESDoc Inject Script Plugin
## Install
```bash
npm install https://github.com/EnterTheNameHere/esdoc-inject-script-plugin.git
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {"name": "esdoc-inject-script-plugin", "option": {"enable": true, "scripts": ["./foo.js"]}}
  ]
}
```

`enable` is default `true`.

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
