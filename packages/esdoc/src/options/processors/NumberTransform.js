import _ from 'lodash';
import { Transform } from './Transform.js';

export class NumberTransform extends Transform {
  static get type() {
    return 'number';
  }

  /**
   * Returns `value` or throws {TypeError} if `value` is not a number.
   * NOTE: Basically just checks if value is a number...
   * @param {number} value 
   * @returns {number}
   * @throws {TypeError} If `value` is not a number.
   */
  transform(value) {
    if(!_.isNumber(value)) {
      throw new TypeError('Number value is expected!');
    }

    return value;
  }
}
