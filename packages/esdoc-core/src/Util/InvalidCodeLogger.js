import fs from 'fs-extra';

/**
 * logger for invalid code which can not be parsed with ESDoc.
 */
class InvalidCodeLogger {
  constructor() {
    this._logs = [];
  }

  /**
   * show log.
   * @param {string} filePath - invalid code in this file.
   * @param {ASTNode} [node] - fail parsing node.
   */
  show(filePath, node) {
    if (!node) {
      this.showFile(filePath);
      return;
    }

    const lines = fs.readFileSync(filePath).toString().split('\n');
    const targetLines = [];
    let start = -1;
    const end = node.loc.start.line;

    if (node.leadingComments && node.leadingComments[0]) {
      start = node.leadingComments[0].loc.start.line;
    } else {
      start = Math.max(0, end - 10);
    }

    for (let i = start - 1; i < end; i++) {
      targetLines.push(`${i + 1}| ${lines[i]}`);
    }

    console.error('[31merror: could not process the following code.[32m');
    console.error(filePath);
    console.error(targetLines.join('\n'));
    console.error('[0m');

    this._logs.push({filePath: filePath, log: [start, end]});
  }

  /**
   * show error log.
   * @param {Error} error - target error.
   */
  showError(error) {
    console.error('[31m');
    console.error(error);
    console.error('[0m');
  }

  /**
   * show log.
   * @param {string} filePath - invalid code in this file.
   * @param {Error} error - error object.
   */
  showFile(filePath, error) {
    const lines = fs.readFileSync(filePath).toString().split('\n');
    if (!Object.prototype.hasOwnProperty.call(error, 'loc')) {
      console.error(`In file '${filePath}':`);
      console.error('[31m');
      console.error(error);
      console.error('[0m');
      return;
    }
    const start = Math.max(error.loc.line - 3, 1);
    const end = Math.min(error.loc.line + 3, lines.length);
    const targetLines = [];
    for (let i = start - 1; i < end; i++) {
      targetLines.push(`${i + 1}| ${lines[i]}`);
    }

    console.warn('[31mwarning: could not parse the following code. if you want to use ECMAScript proposals, see https://esdoc.org/manual/feature.html#ecmascript-proposal[32m');
    console.warn(filePath);
    console.warn(`${targetLines.join('\n')}[0m`);

    this._logs.push({filePath: filePath, log: [start, end]});
  }
}

/**
 * singleton for {@link InvalidCodeLogger}
 */
export default new InvalidCodeLogger();
