import _ from 'lodash';
import { Transform } from './Transform.js';

export class ArrayTransform extends Transform {
  static get type() {
    return 'array';
  }

  /**
   * Processes elements of `values` array by given `valueTransform`. `valueTransform` is expected to be
   * an object with 'transform' method, to which all elements in `values` will be passed one after another, processing
   * the element. Returns an array of processed values. `valueTransform` might throw - checking if `values` are valid
   * values for `valueProcessor` is up on you. Throws {TypeError} if values are not an array and throws {TypeError} if
   * `valueProcessor` doesn't have 'transform' method.
   * 
   * @param {Array<*>} values 
   * @param {{process: function}} valueTransform
   * @returns {Array<*>}
   * @throws {TypeError} If `values` is not an array.
   * @throws {TypeError} If `valueProcessor` doesn't have 'transform' method.
   */
  transform(values, valueTransform) {
    if(!_.isArray(values)) {
      throw new TypeError('An array of values is expected!');
    }

    if(!_.hasIn(valueTransform, 'transform') || !_.isFunction(valueTransform.transform)) {
      throw new TypeError('Processor is expected to be an object with "transform" method!');
    }
    
    const returnValues = [];
    for(const value of values) {
      returnValues.push(valueTransform.transform(value));
    }

    return returnValues;
  }
}
