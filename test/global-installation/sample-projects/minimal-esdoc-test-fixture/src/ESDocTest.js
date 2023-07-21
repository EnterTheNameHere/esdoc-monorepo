import { Identifier } from "./DirectoryA/Identifier";
import { Identifier as IdentifierB } from "./DirectoryB/Identifier";

/**
 * Minimal ESDoc Usage Project. If just the esdoc package alone is used!
 */
export default class ESDocTest {
  /** @type {ESDocTestSingleton|null} This is singleton of ESDocTestSingleton */
  static Singleton = null;
  
  /**
   * Initiates ESDocTest singleton.
   * @public
   */
  static init() {
    if(ESDocTest.Singleton === null) {
      ESDocTest.Singleton = new ESDocTestSingleton(true);
    }
  }
}

class ESDocTestSingleton {
  /**
   * @type {string} Name of Identifier coming from DirectoryB
   */
  IdentifierDirectoryBName = IdentifierB.name;
  
  /**
   * Creates instance.
   * @param {boolean} thisIsTrue - should be true.
   * @throws {Error} If thisIsTrue is not true.
   */
  constructor( thisIsTrue ) {
    if(thisIsTrue !== true) {
      throw new Error('thisIsTrue is not true!');
    }
    
    /**
     * @type {string} Name of Identifier coming from DirectoryA
     */
    this.IdentifierDirectoryAName = Identifier.name;
  }
}
