import fs from 'fs-extra';
import PluginManager from '../Plugin/PluginManager.js';
const BabelParser = require('@babel/parser');

/**
 * ECMAScript Parser class.
 *
 * @example
 * let ast = ESParser.parse('./src/foo.js');
 */
export default class ESParser {
  /**
   * parse ECMAScript source code.
   * @param {string} filePath - source code file path.
   * @returns {AST} AST of source code.
   */
  static parse(filePath) {
    let code = fs.readFileSync(filePath, {encode: 'utf8'}).toString();
    code = PluginManager.onHandleCode(code, filePath);
    if (code.charAt(0) === '#') code = code.replace(/^#!/u, '//');

    let parserOption = {sourceType: 'module', plugins: []};
    let parser = (sourcecode) => {
      return BabelParser.parse(sourcecode, parserOption);
    };

    ({parser, parserOption} = PluginManager.onHandleCodeParser(parser, parserOption, filePath, code));

    let ast = parser(code);

    ast = PluginManager.onHandleAST(ast, filePath, code);

    return ast;
  }
}
