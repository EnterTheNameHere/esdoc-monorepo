# ESDoc Brand Plugin

Use with updated [EnterTheNameHere/esdoc-monorepo](https://github.com/EnterTheNameHere/esdoc-monorepo).
Original esdoc is [here](https://github.com/esdoc/esdoc).

## Install
```bash
npm install @enterthenamehere/esdoc-brand-plugin
```

## Config
This plugin takes a title and a repository from `package.json (name, repository)`.
```json
{
  "source": "./src",
  "destination": "./doc",
  "package.json": "./package.json",
  "plugins": [
    {
      "name": "@enterthenamehere/esdoc-brand-plugin",
      "option": {
        "logo": "./logo.png",
        "title": "My Library",
        "description": "this is awesome library",
        "repository": "https://github.com/foo/bar",
        "site": "http://my-library.org",
        "author": "https://twitter.com/foo",
        "image": "http://my-library.org/logo.png"
      }
    }
  ]
}
```

- `logo` default is `null`
- `title` default is `name` of `package.json`
- `description` default is `description` of `package.json`
- `repository` default is `repository` of `package.json`
- `site` default is `homepage` of `package.json`
- `author` default is `author` of `package.json`
- `image` default is `null`. support an aspect ratio of 1:1

## LICENSE
MIT

## Author
[Ryo Maruyama@h13i32maru](https://github.com/h13i32maru)
