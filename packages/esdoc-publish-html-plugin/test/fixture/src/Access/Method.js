/**
 * this is TestAccessMethod.
 */
export default class TestAccessMethod {
  /**
   * this is method1.
   * @public
   */
  method1(){}

  /**
   * this is method2.
   * @protected
   */
  method2(){}

  /**
   * this is method3.
   * @private
   */
  method3(){}

  /**
   * this is _method4.
   */
  _method4(){}
  
  /**
   * ES2022 private method
   */
  #privateMethod(){}
   
  /**
   * ES2022 static private method
   */
  static #staticPrivateMethod(){}
   
  /**
   * ES2022 private method with private JSDOC tag
   * @private
   */
  #privatePrivateMethod(){}
   
  /**
   * ES2022 static private method with private JSDOC tag
   * @private
   */
  static #privateStaticPrivateMethod(){}
   
  /**
   * ES2022 private method with public JSDOC tag; explicitly will be private
   * @public
   */
  #publicPrivateMethod(){}
   
  /**
   * ES2022 static private method with public JSDOC tag; explicitly will be private
   * @public
   */
  static #publicStaticPrivateMethod(){}
   
  /**
   * ES2022 private get
   */
  get #privateAccessor() { return 42; }
   
  /**
   * ES2022 private set
   */
  set #privateAccessor( value ) {}
}
