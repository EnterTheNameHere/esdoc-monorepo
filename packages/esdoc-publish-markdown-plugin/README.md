# ESDoc Publish Markdown Plugin (PoC)

Use with updated [EnterTheNameHere/esdoc-monorepo](https://github.com/EnterTheNameHere/esdoc-monorepo).
Original esdoc is [here](https://github.com/esdoc/esdoc).

**This plugin is proof of concept.**
**So, the plugin has only minimum features.**
**We are waiting for your pull request!**

## Example
[example](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-publish-markdown-plugin/misc/index.md)

<img src="https://raw.githubusercontent.com/esdoc/esdoc-plugins/master/esdoc-publish-markdown-plugin/misc/ss.png" width="400px">

## Install
```bash
npm install @enterthenamehere/esdoc-publish-markdown-plugin
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {
      "name": "@enterthenamehere/esdoc-publish-markdown-plugin",
      "option": {
        "filename":"README.md"
      }
    }
  ]
}
```

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
