/** @test {TestDescClass} */
describe('Use describe style mocha interface', function () {
  /** @test {TestDescClass#constructor} */
  it('Use it style mocha interface', function () {
  });

  /** @test {TestDescClass#p1} */
  describe('Nested describe', function () {
    /** @test {testDescVariable} */
    it('Nested it in describe', function () {
    });
  });

  /** @test {TestDescClass#method1} */
  context('Use context style mocha interface', function () {
    /** @test {testDescFunction} */
    it('Nested it in context', function () {
    });
  });
});

/** @test {TestDescClass} */
suite('Use suite style mocha interface', function () {
  /** @test {TestDescClass#constructor} */
  test('Use test style mocha interface', function () {
  });

  /** @test {TestDescClass#p1} */
  suite('Nested suite', function () {
    /** @test {TestDescClass#method1} */
    test('Nested test', function () {
    });
  })
});
