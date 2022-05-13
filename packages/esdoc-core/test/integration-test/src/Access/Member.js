export default class TestAccessMember {
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
  
  constructor() {
    /**
     * @public
     * @type {number}
     */
    this.mPublic = 123;

    /**
     * @protected
     * @type {number}
     */
    this.mProtected = 123;

    /**
     * @package
     * @type {number}
     */
    this.mPackage = 123;

    /**
     * @private
     * @type {number}
     */
    this.mPrivate = 123;
  }
}
