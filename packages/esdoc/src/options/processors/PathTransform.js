import _ from 'lodash';
import upath from 'upath';
import { Transform } from './Transform.js';

export class PathTransform extends Transform {
  static get type() {
    return 'path';
  }

  /**
   * Returns normalized path `value` or throws {TypeError} if `value` is not a string.
   * @param {string} value 
   * @returns {string}
   * @throws {TypeError} If `value` is not a string.
   */
  transform(value) {
    if(!_.isString(value)) {
      throw new TypeError('String value is expected!');
    }
    
    return upath.normalizeTrim(value);
  }
}
