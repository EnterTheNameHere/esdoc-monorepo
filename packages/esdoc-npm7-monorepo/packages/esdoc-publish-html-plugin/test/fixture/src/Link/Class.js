/**
 * this is TestLinkClass.
 * link to {@link testLinkFunction}
 */
export default class TestLinkClass {
  /**
   * this is constructor.
   * link to {@link testLinkFunction}
   */
  constructor(){
    /**
     * this is p1.
     * link to {@link testLinkFunction}
     * @type {number}
     */
    this.p1 = 123;
  }

  /**
   * this is method1.
   * link to {@link testLinkFunction}
   */
  method1(){}
}

export class TestLinkClass2 extends TestLinkClass {
}

export class TestLinkClass3 extends TestLinkClass2 {
  /**
   * {@link TestLinkClass2#method1}
   */
  method1FooBar() {
  }
}
