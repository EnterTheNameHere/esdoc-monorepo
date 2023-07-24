import cheerio from 'cheerio';
import { ColorLogger } from '@enterthenamehere/color-logger';

/** @ignore */
const logger = new ColorLogger('IceCap');

/**
 * @class
 * @classdesc IceCap process HTML template with programmable.
 * @fileexample
 * import IceCap from 'ice-cap';
 * let ice = new IceCap('<p data-ice="name"></p>');
 * ice.text('name', 'Alice');
 * console.log(ice.html); // <p data-ice="name">Alice</p>
 */
export default class IceCap {
  static get MODE_APPEND() { return 'append'; }
  static get MODE_WRITE() { return 'write'; }
  static get MODE_REMOVE() { return 'remove'; }
  static get MODE_PREPEND() { return 'prepend'; }

  static get CALLBACK_TEXT() { return 'text'; }
  static get CALLBACK_LOAD() { return 'html'; }
  
  static get debug() { return this._debug; }
  static set debug(v) { this._debug = v; }

  /**
   * create instance with HTML template.
   * @param {!string} html
   * @param {Object} [options]
   * @param {boolean} [options.autoDrop=true]
   * @param {boolean} [options.autoClose=true]
   */
  constructor(html, {autoClose = true, autoDrop = true} = {autoClose: true, autoDrop: true}) {
    if (!html) {
      throw new Error('html must be specified.');
    }

    if (typeof html === 'string') {
      this._$root = cheerio.load(html, { _useHtmlParser2: true, emptyAttrs: false }, false).root();
    } else if (html.find) {
      this._$root = html;
    }
    this._options = {autoClose, autoDrop};
  }

  set autoDrop(val) {
    this._options.autoDrop = val;
  }

  get autoDrop() {
    return this._options.autoDrop;
  }

  set autoClose(val) {
    this._options.autoClose = val;
  }

  get autoClose() {
    return this._options.autoClose;
  }

  /**
   * apply value to DOM that is specified with id.
   * @param {!string} id
   * @param {string} value
   * @param {string} [mode=IceCap.MODE_APPEND]
   * @return {IceCap} self instance.
   */
  text(id, value, mode = this.constructor.MODE_APPEND) {
    const nodes = this._nodes(id);

    if (this._options.autoDrop && !value) {
      nodes.remove();
      return this;
    }

    if (value === null || value === undefined) value = '';

    let transformedValue = null;
    for (const node of nodes.iterator) {
      const currentValue = node.text() || '';
      switch (mode) {
        case this.constructor.MODE_WRITE:
          transformedValue = value;
          break;
        case this.constructor.MODE_APPEND:
          transformedValue = currentValue + value;
          break;
        case this.constructor.MODE_REMOVE:
          transformedValue =  currentValue.replace(new RegExp(value, 'gu'), '');
          break;
        case this.constructor.MODE_PREPEND:
          transformedValue = value + currentValue;
          break;
        default:
          throw new Error(`unknown mode. mode = "${mode}"`);
      }

      node.html(transformedValue);
    }

    return this;
  }

  load(id, ice, mode = this.constructor.MODE_APPEND) {
    let html = '';
    if (ice instanceof IceCap) {
      html = ice.html;
    } else if(ice){
      html = ice.toString();
    }

    const nodes = this._nodes(id);

    if (this._options.autoDrop && !html) {
      nodes.remove();
      return this;
    }

    nodes.attr('data-ice-loaded', '1');
    let transformedValue = null;
    for (const node of nodes.iterator) {
      const currentValue = node.html() || '';
      switch (mode) {
        case this.constructor.MODE_WRITE:
          node.text('');
          transformedValue = html;
          break;
        case this.constructor.MODE_APPEND:
          transformedValue = currentValue + html;
          break;
        case this.constructor.MODE_REMOVE:
          transformedValue = currentValue.replace(new RegExp(html, 'gu'), '');
          break;
        case this.constructor.MODE_PREPEND:
          transformedValue = html + currentValue;
          break;
        default:
          throw new Error(`unknown mode. mode = "${mode}"`);
      }

      node.html(transformedValue);
    }

    return this;
  }

  attr(id, key, value, mode = this.constructor.MODE_APPEND) {
    const nodes = this._nodes(id);
    let transformedValue = null;

    if (value === null || value === undefined) value = '';

    for (const node of nodes.iterator) {
      const currentValue = node.attr(key) || '';
      switch (mode) {
        case this.constructor.MODE_WRITE:
          transformedValue = value;
          break;
        case this.constructor.MODE_APPEND:
          transformedValue = currentValue + value;
          break;
        case this.constructor.MODE_REMOVE:
          transformedValue = currentValue.replace(new RegExp(value, 'gu'), '');
          break;
        case this.constructor.MODE_PREPEND:
          transformedValue = value + currentValue;
          break;
        default:
          throw new Error(`unknown mode. mode = "${mode}"`);
      }

      node.attr(key, transformedValue);
    }

    return this;
  }

  loop(id, values, callback) {
    if (!Array.isArray(values)) {
      throw new Error(`values must be array. values = "${values}"`);
    }

    if (['function', 'string'].indexOf(typeof callback) === -1) {
      throw new Error(`callback must be function. callback = "${callback}"`);
    }

    if (typeof callback === 'string') {
      switch (callback) {
        case this.constructor.CALLBACK_TEXT:
          callback = (i, value, ice) => { return ice.text(id, value); };
          break;
        case this.constructor.CALLBACK_LOAD:
          callback = (i, value, ice) => { return ice.load(id, value); };
          break;
        default:
          throw new Error(`unknown callback. callback = "${callback}"`);
      }
    }

    const nodes = this._nodes(id);

    if (values.length === 0) {
      nodes.remove();
      return this;
    }

    for (const node of nodes.iterator) {
      const results = [];
      for (let j = 0; j < values.length; j++) {
        const parent = cheerio.load('<div/>', { _useHtmlParser2: true, emptyAttrs: false }, false).root();
        const clonedNode = node.clone();
        const textNode = cheerio.load('\n', { _useHtmlParser2: true, emptyAttrs: false }, false).root();

        parent.append(clonedNode);
        results.push(clonedNode[0]);
        results.push(textNode[0]);

        const ice = new IceCap(parent);
        callback(j, values[j], ice);
      }

      if (node.parent().length) {
        node.parent().append(results);
      } else {
        this._$root.append(results);
      }
      node.remove();
    }

    return this;
  }

  into(id, value, callback) {
    const nodes = this._nodes(id);

    if (value === '' || value === null || value === undefined) {
      nodes.remove();
      return this;
    }
    else if (Array.isArray(value)) {
      if (value.length === 0) {
        nodes.remove();
        return this;
      }
    }

    if (typeof callback !== 'function') {
      throw new Error(`callback must be function. callback = "${callback}"`);
    }

    for (const node of nodes.iterator) {
      const ice = new IceCap(node);
      callback(value, ice);
    }

    return this;
  }

  drop(id, isDrop = true) {
    if (!isDrop) return this;

    const nodes = this._nodes(id);
    nodes.remove();

    return this;
  }

  close() {
    if (!this._$root) return this;

    this._html = this._takeHTML();
    this._$root = null;
    return this;
  }

  get html() {
    if (!this._$root) return this._html;

    this._html = this._takeHTML();

    if (this._options.autoClose) {
      this.close();
    }

    return this._html;
  }

  _nodes(id) {
    if (!this._$root) throw new Error('can not operation after close.');
    if (!id) throw new Error('id must be specified.');

    const $nodes = this._$root.find(`[data-ice="${id}"]`);

    const filtered = this._filter($nodes);

    if (filtered.length === 0 && this.constructor._debug) logger.w(`node not found. id = ${id}`);

    return filtered;
  }

  _filter(nodes) {
    const results = [];
    for (let ii = 0; ii < nodes.length; ii = ii + 1) {
      const node = nodes.eq(ii);
      const length = node.parents('[data-ice-loaded]').length;
      if (length === 0) {
        results.push(node[0]);
      }
    }

    const $result = cheerio(results, null, null, { _useHtmlParser2: true, emptyAttrs: false });

    Object.defineProperty($result, 'iterator', {
      get: function() {
        const nodes2 = [];
        for (let ii = 0; ii < this.length; ii = ii + 1) {
          nodes2.push(this.eq(ii));
        }
        return nodes2;
      }
    });

    return $result;
  }

  _takeHTML(){
    const loadedNodes = this._$root.find('[data-ice-loaded]').removeAttr('data-ice-loaded');

    const html = this._$root.html();

    loadedNodes.attr('data-ice-loaded', 1);

    return html;
  }
}
