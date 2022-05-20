/**
 * this is TestAccessProperty.
 */
export default class TestAccessProperty {
  /**
   * ES2022 private field
   * @type {number}
   */
  #privateField = 42;
  
  /**
   * ES2022 static private field
   * @type {number}
   */
  static #staticPrivateField = 42;
 
  /**
   * ES2022 private field with private JSDOC tag
   * @type {number}
   * @private
   */
  #privatePrivateField = 42;
   
  /**
   * ES2022 static private field with private JSDOC tag
   * @type {number}
   * @private
   */
  static #privateStaticPrivateField = 42;
 
  /**
   * ES2022 private field with public JSDOC tag; explicitly will be private
   * @type {number}
   * @public
   */
  #publicPrivateField = 42;
   
  /**
   * ES2022 static private field with public JSDOC tag; explicitly will be private
   * @type {number}
   * @public
   */
  static #publicStaticPrivateField = 42;
  
  /* TODO: check the following properties are caught by linter */

  #privateFieldWithoutCommentShouldBePickedUpByLint = 42;
  
  static #staticPrivateFieldWithoutCommentShouldBePickedUpByLint = 42;
  
  #privatePrivateFieldWithoutCommentShouldBePickedUpByLint = 42;
   
  static #privateStaticPrivateFieldWithoutCommentShouldBePickedUpByLint = 42;
  
  #publicPrivateFieldWithoutCommentShouldBePickedUpByLint = 42;
    
  static #publicStaticPrivateFieldWithoutCommentShouldBePickedUpByLint = 42;
  
  constructor() {
    /**
     * this is p1.
     * @public
     * @type {number}
     */
    this.p1 = 123;

    /**
     * this is p2.
     * @protected
     * @type {number}
     */
    this.p2 = 123;
    
    /**
     * this is p3.
     * @private
     * @type {number}
     */
    this.p3 = 123;

    /**
     * this is _p4.
     * @type {number}
     */
    this._p4 = 123;
  }
}
