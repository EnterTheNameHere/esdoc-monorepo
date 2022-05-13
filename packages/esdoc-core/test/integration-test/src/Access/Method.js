export default class TestAccessMethod {
  /**
   * @public
   */
  methodPublic(){}

  /**
   * @protected
   */
  methodProtected(){}

  /**
   * @package
   */
  methodPackage(){}

  /**
   * @private
   */
  methodPrivate(){}

  /**
   *  @access public
   */
   moreSpacesBetweenAsteriskAndAtSymbol1(){}

   /**
    *           @access public
    */
   moreSpacesBetweenAsteriskAndAtSymbol2(){}
 
   /**
    *                @access public
    */
   moreSpacesBetweenAsteriskAndAtSymbol3(){}
   
   /**
    *            @public
    */
   moreSpacesBetweenAsteriskAndAtSymbol4(){}
 
   /**
    *                @private
    */
    moreSpacesBetweenAsteriskAndAtSymbol5(){}
 
    /**
    *       @protected
    */
   moreSpacesBetweenAsteriskAndAtSymbol6(){}
 
   /**
    *@access public
    */
    noSpacesBetweenAsteriskAndAtSymbol(){}
    
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
     * @returns {number} It's 42
     */
    get #privateAccessor() { return 42; }
    
    /**
     * ES2022 private set
     * @param {number} value this is param
     */
    set #privateAccessor( value ) {}

    /**
     * ES2022 async private method
     * @param {number} [param=42] with one parameter
     */
    async #asyncPrivateMethod( param = 42 ){ this.#privateAccessor = param; }

    /**
     * ES2022 async static private method
     */
    static async #asyncStaticPrivateMethod(){}
}
