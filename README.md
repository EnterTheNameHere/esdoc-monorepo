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
    "plugins": [{"name": "esdoc-standard-plugin"}]
}
```

No need to use @enterthenamehere/esdoc-standard-plugin in config anymore! No need to change configs. 
You still need to use @enterthenamehere/ when installing packages with npm though.

## Plugins
You probably want to install [esdoc-standard-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-standard-plugin) pack.

It contains these plugins:

Plugin | Description
---------------- | ---------------
[esdoc-accessor-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-accessor-plugin) | Is that public, protected, or private?
[esdoc-brand-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-brand-plugin) | Cool features like describing your package, setting logo, or... setting repository...
[esdoc-coverage-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-coverage-plugin) | Do you know you have only 4 of 20 identifiers in this file documented? Now you do...
[esdoc-ecmascript-proposal-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-ecmascript-proposal-plugin) | Who wants ESNext? We want ESNext! So parse ESNext...
[esdoc-external-ecmascript-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-external-ecmascript-plugin)|What is Object? What is number? What is RegExp? But why it links to MDN?
[esdoc-integrate-manual-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-integrate-manual-plugin) | Tell us which files are part of manual!
[esdoc-integrate-test-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-integrate-test-plugin) | Because pros use their tests even in documentation!
[esdoc-lint-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-lint-plugin) | Hey man, these function parameters don't match what you documented...
[esdoc-publish-html-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-publish-html-plugin) | **The real deal** View it all in your favorite browser, all in rgb quality!
[esdoc-type-inference-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-type-inference-plugin) | Why didn't you document it? Ok, I'll try to guess - is that variable a string? Probably not, since it's 42...
[esdoc-undocumented-identifier-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-undocumented-identifier-plugin) | Lazy to document that variable huh? You won't get rid of it that easily!
[esdoc-unexported-identifier-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-unexported-identifier-plugin) | Nah, you can't use it, but I flex and show it's there anyway!

Just use
```bash
npm install @enterthenamehere/esdoc-standard-plugin
```
 
 
 
 
ESDoc offers even more plugins, but you have to install these individually:

[esdoc-exclude-source-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-exclude-source-plugin)
[esdoc-external-nodejs-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-external-nodejs-plugin)
[esdoc-external-webapi-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-external-webapi-plugin)
[esdoc-flow-type-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-flow-type-plugin)
[esdoc-inject-gtm-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-inject-gtm-plugin)
[esdoc-inject-script-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-inject-script-plugin)
[esdoc-inject-style-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-inject-style-plugin)
[esdoc-importpath-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-importpath-plugin)
[esdoc-publish-markdown-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-publish-markdown-plugin)
[esdoc-react-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-react-plugin)
[esdoc-jsx-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-jsx-plugin)
[esdoc-typescript-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-typescript-plugin)

## LICENSE
MIT

## Thank you goes to author of ESDoc
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
