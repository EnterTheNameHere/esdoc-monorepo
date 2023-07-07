import _ from 'lodash';
import { Transform } from './Transform.js';

export class StringTransform extends Transform {
  static get type() {
    return 'string';
  }

  /**
   * Returns `value` or throws {TypeError} if `value` is not a string. Empty string is allowed.
   * NOTE: Basically just checks if value is a string...
   * @param {string} value 
   * @returns {string}
   * @throws {TypeError} If `value` is not a string.
   */
  transform(value) {
    if(!_.isString(value)) {
      throw new TypeError('String value is expected!');
    }
  
    return value;
  }
}
