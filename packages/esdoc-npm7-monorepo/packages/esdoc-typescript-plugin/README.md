# ESDoc TypeScript Plugin (PoC)

Use with updated [EnterTheNameHere/esdoc-monorepo](https://github.com/EnterTheNameHere/esdoc-monorepo).
Original esdoc is [here](https://github.com/esdoc/esdoc).

**This plugin is proof of concept**

## Install
```bash
npm install @enterthenamehere/esdoc-typescript-plugin
```

## Config
```json
{
  "source": "./src",
  "destination": "./doc",
  "plugins": [
    {"name": "@enterthenamehere/esdoc-typescript-plugin", "option": {"enable": true}}
  ]
}
```

- `enable` is default `true`

## Example
```js
export class Foo {
  // without document, with initializer
  member: number = 10;
  
  // without document
  method1(n: number): string {
  }
  
  // without @param and @return
  /**
   * this is method2.
   */
  method2(n: number): string {
  }
  
  // without type in @param and @return
  /**
   * this is method3.
   * @param n - this is param desc.
   * @return this is return desc.
   */
  method3(n: number): string {
  }
}
```

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
