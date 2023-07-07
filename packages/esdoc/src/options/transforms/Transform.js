/**
 * Base class for Transforms.
 * 
 * The purpose of {Transform}s is to take a value of type specified by {this#type}, and perform a transformation
 * on it. That could be anything from taking a string and making it number, taking an array and producing object
 * or taking a string and returning normalized version usable on all platforms. To do this, override {this#transform}.
 * 
 * How to extend this class:
 * 
 * @example
 * import { Transform } from './Transform.js';
 * export class NumberTransform extends Transform { // This is not real NumberTransform implementation, just an example.
 *   static get type() { // Needs to be static. The type must be accessible without an instance.
 *     return 'number'; // Specifies this Transform subclass can work with 'number' type.
 *   }
 * 
 *   transform(value) { // This one is not static. Each OptionType should have its own instance to prevent data race.
 *     return Number(value); // Returns transformed value.
 *   }
 * }
 */
export class Transform {
  /**
   * @abstract
   * This method is to be overridden by subclasses.
   */
  transform() {
    const message = 'Transform#transform() method is expected to be overridden in subclass. Seems developer '
    + "made a mistake and base Transform class was called instead. Tell him he's dummy when you report it, please.";
    console.error(message);
    console.error('Transform#type: %O', this.constructor.type());
    throw new Error(message);
  }
}
