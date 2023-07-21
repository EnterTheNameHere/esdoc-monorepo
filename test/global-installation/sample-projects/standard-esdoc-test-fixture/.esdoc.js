module.exports = {
  "source": "./src",
  "destination": "./docs",
//  "ast": true,
  "debug": true,
  "verbose": true,
  "includes": /*[*/
    "**/*.js[m]"
  /*]*/,
  "excludes": [
    "*.config.js",
    "*modules/"
  ],
  "index": "./README.md",
  "package": "./package.json",
  "plugins": [{
    "name": "esdoc-standard-plugin",
    "option": {
      "accessor": { "access": ["public", "protected"], "autoPrivate": true },
      "lint": {},
      "coverage": {},
      "undocumentIdentifier": { "enable": true }, // Should include undocumented identifiers to documentation
      "unexportedIdentifier": { "enable": true }, // Should include identifiers which are not exported (eg. are local/file scope) into documentation too
      "typeInference": {}
    }
  }]
}
