/**
 * @test {TestTarget1}
 */
describe('describe/', function () {
  /**
   * @test {TestTarget2}
   */
  it('describe/it', () => {} );

  /**
   * @test {TestTarget3}
   */
  describe('describe/describe/', () => {
    /**
     * @test {TestTarget4}
     */
    it('describe/describe/it', function () {} );
  });

  /**
   * @test {TestTarget5}
   */
  context('describe/context/', function () {
    /**
     * @test {TestTarget6}
     */
    it('describe/context/it', function () {} );
  });
});

/**
 * @test {TestTarget7}
 */
suite('suite/', () => {
  /**
   * @test {TestTarget8}
   */
  test('suite/test', () => {} );

  /**
   * @test {TestTarget9}
   */
  suite('suite/suite/', function () {
    /**
     * @test {TestTarget10}
     */
    test('suite/suite/test', function () {} );
  })
});
