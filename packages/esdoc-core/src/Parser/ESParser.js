import PluginManager from '../Plugin/PluginManager.js';
import { FileManager } from '../Util/FileManager';
const BabelParser = require('@babel/parser');

console.log('__filename', __filename, '__dirname', __dirname);

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
    let code = FileManager.readFileContents(filePath);
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
