// ASCII ESCAPE SEQUENCE http://www5c.biglobe.ne.jp/~ecb/assembler2/b_2.html
const levelToColor = {
  n: '[N]', // no color
  v: '[35m[V]', // purple
  d: '[34m[D]', // blue
  i: '[32m[I]', // green
  w: '[33m[W]', // yellow
  e: '[31m[E]'  // red
};

/**
 * display colorful log. now, not support browser.
 *
 * format:
 * ``[LogLevel] [Time] [File] log text``
 *
 * format with tag:
 * ``[LogLevel] [Time] [File] [Tag] log text``
 *
 * log level and color:
 * - verbose: purple
 * - debug: blue
 * - info: green
 * - warning: yellow
 * - error: red
 *
 * @example
 * import Logger from '@enterthenamehere/color-logger'
 *
 * // simple usage
 * Logger.v('verbose log');
 *
 * // tag usage
 * let logger = new Logger('MyTag');
 * logger.d('debug log');
 */
export class ColorLogger {
  /**
   * create instance.
   */
  constructor() {
    this._allLogs = [];
  }

  /**
   * log information.
   * @return {string} - file name and line number.
   * @private
   */
  _getInfo() {
    let info = "";
    try {
      throw new Error();
    } catch (e) {
      const lines = e.stack.split('\n');
      const line = lines[4];
      const matched = line.match(/([\w\d\-_.]*:\d+:\d+)/u);
      info = matched[1];
    }

    return info;
  }

  /**
   * clear all logs.
   */
  clearAllLogs() {
    this._allLogs = [];
  }

  /**
   * all logs
   * @type {String[]}
   */
  get allLogs() {
    return [].concat(this._allLogs);
  }
  
  /**
   * @return {boolean} if false, not display log. default is true.
   */
  get debug() {
      return this._debug;
  }

  /**
   * if false, not display log. default is true.
   */
  set debug(v) {
    this._debug = v;
  }

  /**
   * display log.
   * @param {string} level - log level. v, d, i, w, e.
   * @param {...*} msg - log message.
   * @returns {string} - formatted log message.
   * @private
   */
  _output(level, ...msg) {
    if(typeof(level) !== "string") {
      level = "n";
    }

    if(["v", "d", "i", "w", "e", "n"].indexOf(level) === -1) {
      level = "n";
    }

    const text = [];
    for (const m of msg) {
      if (typeof m === 'object') {
        text.push(JSON.stringify(m, null, 2));
      } else {
        text.push(m);
      }
    }

    // level is checked for being a string and one of supported letters
    const color = levelToColor[level]; // don't silence eslint
    const info = this._getInfo();

    const d = new Date();
    let month = d.getMonth() + 1;
    if (month < 10) month = `0${month}`;
    let date = d.getDate();
    if (date < 10) date = `0${date}`;
    let hour = d.getHours();
    if (hour < 10) hour = `0${hour}`;
    let minutes = d.getMinutes();
    if (minutes < 10) minutes = `0${minutes}`;
    let sec = d.getSeconds();
    if (sec < 10) sec = `0${sec}`;
    const now = `${d.getFullYear()}-${month}-${date}T${hour}:${minutes}:${sec}.${d.getMilliseconds()}Z`;

    const log = `${color} [${now}] [${info}] ${text.join(' ')}[0m`;
    const offColorLog = `[${level.toUpperCase()}] [${now}] [${info}] ${text.join(' ')}`;

    this._allLogs.push(offColorLog);
    if (this._allLogs.length > 10000) this._allLogs.shift();

    // eslint-disable-next-line no-console
    if (this._debug) console.log(log);

    return log;
  }

  /**
   * display verbose(purple) log.
   * @param {...*} msg - log message.
   * @returns {string} formatted log message.
   */
  v(...msg) {
    return this._output('v', ...msg);
  }

  /**
   * display debug(blue) log.
   * @param {...*} msg - log message.
   * @returns {string} formatted log message.
   */
  d(...msg) {
    return this._output('d', ...msg);
  }

  /**
   * display normal(no color) log.
   * @param {...*} msg - log message.
   * @returns {string} formatted log message.
   */
  n(...msg) {
    return this._output('n', ...msg);
  }

  /**
   * display info(green) log.
   * @param {...*} msg - log message.
   * @returns {string} formatted log message.
   */
  i(...msg) {
    return this._output('i', ...msg);
  }

  /**
   * display warning(yellow) log.
   * @param {...*} msg - log message.
   * @returns {string} formatted log message.
   */
  w(...msg) {
    return this._output('w', ...msg);
  }

  /**
   * display warning(red) log.
   * @param {...*} msg - log message.
   * @returns {string} formatted log message.
   */
  e(...msg) {
    return this._output('e', ...msg);
  }
}

const logger = new ColorLogger();
logger.debug = true;
export default logger;
