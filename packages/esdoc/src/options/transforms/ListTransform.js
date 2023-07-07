import _ from 'lodash';
import { Transform } from './Transform.js';

export class ListTransform extends Transform {
  static get type() {
    return 'list';
  }

  /**
   * Returns `value` if `value` is found among `possibleValues` array elements. Returns *null* if value is not found
   * in array. Uses === for comparison. Throws {TypeError} if `value` is *undefined* or *null*, and throws {TypeError}
   * if possibleValues is not an array.
   * @param {*} value 
   * @param {Array<*>} possibleValues 
   * @returns {*|null}
   * @throws {TypeError} If `value` is *undefined* or *null*.
   * @throws {TypeError} If `possibleValues` is not an array.
   */
  transform(value, possibleValues = []) {
    if(_.isNil(value)) {
      throw new TypeError('Value cannot be null or undefined!');
    }

    if(!_.isArray(possibleValues)) {
      throw new TypeError('List of possible values should be an array!');
    }

    for(const possibleValue of possibleValues) {
      if(possibleValue === value) {
        return value;
      }
    }

    return null;
  }
}
