import _ from 'lodash';
import { Transform } from './Transform.js';

export class BooleanTransform extends Transform {
  static get type() {
    return 'boolean';
  }

  /**
   * Returns `value` or throws {TypeError} if `value` is not a boolean.
   * NOTE: Basically just checks if value is a boolean.
   * @param {boolean} value 
   * @returns {boolean}
   * @throws {TypeError} If `value` is not a boolean.
   */
  transform(value) {
    if(!_.isBoolean(value)) {
      throw new TypeError('Boolean value is expected!');
    }

    return value;
  }
}
