# API

You can modify data(config, code, parser, AST, doc and content) at hook points with plugins.

## Config

```json
{
  "source": "./src",
  "destination": "./docs",
  "plugins": [
    {
      "name": "my-plugin",
      "options": {
        "foo": 123
      }
    }
  ]
}
```

Config for a plugin is an object with two properties: **name** and **options**.
**name** can be an npm package (e.g. `esdoc-foo-plugin`) or a path to a file (e.g. `./my-plugin.js`)
**options** is an object where you can set properties and their values.

## Plugin API

<div class="file-path">MyPlugin.js</div>

```javascript
class MyPlugin {
  onInitialize(options, globalOptions) {
    // Run once, when plugin is registered with PluginManager
    // If you want to require some other plugins, do it here by calling PluginManager
  }

  onStart(ev) {
    console.log(ev.data);
  }
  
  onHandleConfig(ev) {
    // modify config
    ev.data.config.title = ...;
  }
  
  onHandleCode(ev) {
    // modify code
    ev.data.code = ...;
  }
  
  onHandleCodeParser(ev) {
    // modify parser
    ev.data.parser = function(code){ ... };
  }
  
  onHandleAST(ev) {
    // modify AST
    ev.data.ast = ...;
  }
  
  onHandleDocs(ev) {
    // modify docs
    ev.data.docs = ...;
  };
  
  onPublish(ev) {
    // write content to output dir
    ev.data.writeFile(filePath, content);
    
    // copy file to output dir
    ev.data.copyFile(src, dest);
    
    // copy dir to output dir
    ev.data.copyDir(src, dest);
    
    // read file from output dir
    ev.data.readFile(filePath);
  };
  
  onHandleContent(ev) {
    // modify content
    ev.data.content = ...;
  };
  
  onComplete(ev) {
    // complete
  };
}

// exports plugin
module.exports = new MyPlugin();
```

Check other plugins to learn more.

