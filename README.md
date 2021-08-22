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
[esdoc-accessor-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-accessor-plugin) | You can specify if you want private identifiers in documentation.
[esdoc-brand-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-brand-plugin) | Cool features like describing your package, a logo, or... repository url.
[esdoc-coverage-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-coverage-plugin) | Information like: you have only 4 of 20 identifiers in this file documented.
[esdoc-ecmascript-proposal-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-ecmascript-proposal-plugin) | Makes ESDoc parse ESNext code.
[esdoc-external-ecmascript-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-external-ecmascript-plugin) | Recognizes ECMAScript objects and point to MDN docs.
[esdoc-integrate-manual-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-integrate-manual-plugin) | You can specify files which will make a manual section.
[esdoc-integrate-test-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-integrate-test-plugin) | Links tests to objects they test.
[esdoc-lint-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-lint-plugin) | Checks if there is a mismatch between documentation and code, like in function signatures.
[esdoc-publish-html-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-publish-html-plugin) | **The real deal**: Generates HTML for viewing in your favorite browser.
[esdoc-type-inference-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-type-inference-plugin) | Guesses identifier's type in case it's not specified.
[esdoc-undocumented-identifier-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-undocumented-identifier-plugin) | If you don't want to have unexported identifiers in docs.
[esdoc-unexported-identifier-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-unexported-identifier-plugin) | If you don't want to have unexported identifiers in docs.

Just use
```bash
npm install @enterthenamehere/esdoc-standard-plugin
```
 
 
 
 
ESDoc offers even more plugins, but you have to install these individually:

[esdoc-exclude-source-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-exclude-source-plugin) | Do not add source code files into documentation.
[esdoc-external-nodejs-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-external-nodejs-plugin) | Makes ESDoc recognize Node.js identifiers and point to their manual.
[esdoc-external-webapi-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-external-webapi-plugin) | Makes ESDoc recognize WebAPI identifiers and point to their manual.
[esdoc-flow-type-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-flow-type-plugin) | Makes ESDoc parse and document Flow.
[esdoc-inject-gtm-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-inject-gtm-plugin) | Injects Google Tag Manager. (I don't know how that works...)
[esdoc-inject-script-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-inject-script-plugin) | Injects script into HTML layout.
[esdoc-inject-style-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-inject-style-plugin) | Injects style into HTML layout.
[esdoc-importpath-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-importpath-plugin) | Renames directories/files based on a pattern.
[esdoc-publish-markdown-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-publish-markdown-plugin) | Generates documentation as markdown.
[esdoc-react-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-react-plugin) | Makes ESDoc parse React.
[esdoc-jsx-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-jsx-plugin) | Makes ESDoc parse JSX.
[esdoc-typescript-plugin](https://github.com/EnterTheNameHere/esdoc-monorepo/tree/main/packages/esdoc-typescript-plugin) | Makes ESDoc parse TypeScript.

## LICENSE
MIT

## Thank you goes to author of ESDoc
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
