import { expect } from 'chai';
import { loadCheerio , fileNameToDescription} from './../../util.js';

/** @test {FunctionDoc#@_name} */
describe(fileNameToDescription(__filename, 'test export arrow function'), function () {
  const $ = loadCheerio('function/index.html');

  describe('default anonymous arrow function export', function () {
    const arrowFunctions = $('[id*="static-function-ArrowFunction"]').parents('[data-ice="detail"]');
    expect( arrowFunctions.length ).to.equal(2);

    it('has first anonymous arrow function', function () {
      const firstArrowFunction = arrowFunctions.eq(0);
      expect( $('[data-ice="access"]', firstArrowFunction).html() ).to.equal('public');
      expect( $('[data-ice="name"]', firstArrowFunction).html() ).to.equal('ArrowFunction');
      expect( $('[data-ice="importPath"]', firstArrowFunction).text() ).to.equal('import ArrowFunction from \'esdoc-test-fixture/src/Export/ArrowFunction.js\'');
      expect( $('[data-ice="description"] p', firstArrowFunction).html() ).to.equal('this is ArrowFunction.');
    });

    it('has second anonymous arrow function' ,function () {
      const secondArrowFunction = arrowFunctions.eq(1);
      expect( $('[data-ice="access"]', secondArrowFunction).html() ).to.equal('public');
      expect( $('[data-ice="name"]', secondArrowFunction).html() ).to.equal('ArrowFunction');
      expect( $('[data-ice="importPath"]', secondArrowFunction).text() ).to.equal('import ArrowFunction from \'esdoc-test-fixture/src/ArrowFunction.js\'');
      expect( $('[data-ice="description"] p', secondArrowFunction).html() ).to.equal('This is another anonymous arrow function to test multiple anonymous default exports.');
    })
  });

  it('has named import path with direct arrow function definition.', function () {
    const importText = $('[id="static-function-testExportArrowFunction2"]').parents('[data-ice="detail"]').children('[data-ice="importPath"]').text();
    expect( importText ).to.equal("import {testExportArrowFunction2} from 'esdoc-test-fixture/src/Export/ArrowFunction.js'");
  });

  it('is not documented with direct arrow function expression', function () {
    const thisFunctionIsNotExportedAndThusNotAvailable = $('[id="static-function-testExportArrowFunction3"]').parents('[data-ice="detail"]');
    expect( thisFunctionIsNotExportedAndThusNotAvailable.length ).to.equal(0);
  });

  it('has named import path with undocument', function () {
    const importText = $('[id="static-function-testExportArrowFunction4"]').parents('[data-ice="detail"]').children('[data-ice="importPath"]').text();
    expect( importText ).to.equal("import {testExportArrowFunction4} from 'esdoc-test-fixture/src/Export/ArrowFunction.js'");
  });

  it('has named import path with indirect function definition.', function () {
    const importText = $('[id="static-function-testExportArrowFunction5"]').parents('[data-ice="detail"]').children('[data-ice="importPath"]').text();
    expect( importText ).to.equal("import {testExportArrowFunction5} from 'esdoc-test-fixture/src/Export/ArrowFunction.js'");
  });
});
