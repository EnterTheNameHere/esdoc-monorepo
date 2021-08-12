## @enterthenamehere/esdoc-monorepo

Welcome to @enterthenamehere/esdoc-monorepo

Original [ESDoc](https://github.com/esdoc/esdoc) is unfortunately no more mantained, so it will break generation of documentation if you use any ESNext feature in your code. That's why I've updated ESDoc and it's plugins and for ease of maintaining the whole suite put it into a single monorepository.

## What's new/different from ESDoc?
* New scope: all my packages are under @enterthenamehere/ scope;
* Moved "core" of ESDoc documentation generation functionality into it's own package: esdoc-core;
* Updated to babel 7, enabling parsing of ESNext features;
* Added esdoc-ecmascript-proposal-plugin to esdoc-standard-plugin, so you can use ESNext right away;
* Updated dependencies to get rid of high risk vulnerabilities;
* Replaced prettify with highlight.js - it's not 100% replacement though, so if you see issues, do tell;
* Monorepository is using [lerna](https://github.com/lerna/lerna);

## Install
So how do I use your version of ESDoc?
```bash
npm install @enterthenamehere/esdoc @enterthenamehere/esdoc-standard-plugin
```

and you can run esdoc by
```bash
npx esdoc
```
or use it in npm "script"
```json
{
    "scripts": {
        "esdoc": "esdoc"
    }
}
```

## Config
esdoc.json
```json
{
    "source": "./src",
    "destination": "./docs",
    "plugins": [{"name": "@enterthenamehere/esdoc-standard-plugin"}]
}
```

## LICENSE
MIT

## Thank you goes to author of ESDoc
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
