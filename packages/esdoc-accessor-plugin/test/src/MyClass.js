export default class MyClass {
  /**
   * method1 is default access.
   */
  method1(){}

  /**
   * method2 is public.
   * @public
   */
  method2(){}

  /**
   * method3 is protected.
   * @protected
   */
  method3(){}

  /**
   * method4 is private.
   * @private
   */
  method4(){}

  /**
   * method5 is auto private.
   */
  _method5(){}

  /**
   * unnamed method.
   */
  function(){}
  
  // ES2022
  /**
   * ES2022 private method
   */
  #privateMethod(){}

  /**
   * ES2022 static private method
   */
  static #staticPrivateMethod(){}
  
  /**
   * ES2022 private get
   */
  get #privateAccessor() { return 42; }
  
  /**
   * ES2022 private set
   */
  set #privateAccessor( value ) {}
  
  /**
   * ES2022 private field
   */
  #privateField = 42;
  
  /**
   * ES2022 static private field
   */
  static #staticPrivateField = 42;
}

/**
  * unnamed method.
  */
MyClass.prototype['@@iterator'] = function(){
  return this;
};

/**
  * unnamed arrow method.
  */
MyClass.prototype['@@asyncIterator'] = () => {
  return undefined;
};
