const path = require('path');
const fs = require('fs-extra');
const TestDocFactory = require('./TestDocFactory');

console.log('__filename', __filename, '__dirname', __dirname);

// hack
const ESParser = require('@enterthenamehere/esdoc-core/lib/Parser/ESParser').default;
const InvalidCodeLogger = require('@enterthenamehere/esdoc-core/lib/Util/InvalidCodeLogger').default;
const PathResolver = require('@enterthenamehere/esdoc-core/lib/Util/PathResolver').default;
const ASTUtil = require('@enterthenamehere/esdoc-core/lib/Util/ASTUtil').default;

class Plugin {
  onHandleDocs(ev) {
    this._docs = ev.data.docs;
    this._option = ev.data.option;
    this._globalOption = ev.data.globalOption;
    this._FileManager = ev.FileManager;

    this._exec();
  }

  _exec() {
    this._setDefault();

    const docs = this._generateDocs();
    this._docs.push(...docs);
  }

  _setDefault() {
    if (!this._option) return;

    const option = this._option;
    if( typeof(option.source) !== 'string' ) {
        console.error('[31mesdoc-integrate-test-plugin: option.source must be a directory![0m');
        throw new Error('esdoc-integrate-test-plugin: option.source must be a directory!');
    }
    if (!option.interfaces) option.interfaces = ['describe', 'it', 'context', 'suite', 'test'];
    if (!option.includes) option.includes = ['(spec|Spec|test|Test)\\.js$'];
    if (!option.excludes) option.excludes = ['\\.config\\.js$'];
  }

  /**
   * Generate document from test code.
   */
  _generateDocs() {
    const option = this._option;
    const results = [];

    if (!option) return results;

    const includes = option.includes.map((v) => { return new RegExp(v, 'u'); });
    const excludes = option.excludes.map((v) => { return new RegExp(v, 'u'); });
    const sourceDirPath = path.resolve(option.source);

    this._walk(option.source, (filePath) => {
      const relativeFilePath = path.relative(sourceDirPath, filePath);
      let match = false;
      for (const reg of includes) {
        if (relativeFilePath.match(reg)) {
          match = true;
          break;
        }
      }
      if (!match) return;

      for (const reg of excludes) {
        if (relativeFilePath.match(reg)) return;
      }

      if(this._globalOption.verbose) console.info(`parse: ${filePath}`);
      const temp = this._traverse(option.interfaces, option.source, filePath);
      if (!temp) return;
      results.push(...temp.results);

      // todo: enable work
      // asts.push({filePath: `test${path.sep}${relativeFilePath}`, ast: temp.ast});
    });

    return results;
  }

  /**
   * walk recursive in directory.
   * @param {string} dirPath - target directory path.
   * @param {function(entryPath: string)} callback - callback for find file.
   * @private
   */
  _walk(dirPath, callback) {
    const entries = fs.readdirSync(dirPath);

    for (const entry of entries) {
      const entryPath = path.resolve(dirPath, entry);
      const stat = this._FileManager.getFileStat(entryPath);

      if (stat.isFile()) {
        callback(entryPath);
      } else if (stat.isDirectory()) {
        this._walk(entryPath, callback);
      }
    }
  }

  /**
   * traverse doc comment in test code file.
   * @param {string[]} interfaces - test interface names.
   * @param {string} inDirPath - root directory path.
   * @param {string} filePath - target test code file path.
   * @returns {Object} return document info that is traversed.
   * @property {DocObject[]} results - this is contained test code.
   * @property {AST} ast - this is AST of test code.
   * @private
   */
  _traverse(interfaces, inDirPath, filePath) {
    let ast = null;
    try {
      ast = ESParser.parse(filePath);
    } catch (e) {
      InvalidCodeLogger.showFile(filePath, e);
      return null;
    }
    const pathResolver = new PathResolver(inDirPath, filePath);
    const factory = new TestDocFactory(interfaces, ast, pathResolver);

    ASTUtil.traverse(ast, (node, parent) => {
      try {
        factory.push(node, parent);
      } catch (e) {
        InvalidCodeLogger.show(filePath, node);
        throw e;
      }
    });

    return {results: factory.results, ast: ast};
  }
}

module.exports = new Plugin();
