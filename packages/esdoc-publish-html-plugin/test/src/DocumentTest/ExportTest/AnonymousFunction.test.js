import { expect } from 'chai';
import {loadCheerio, fileNameToDescription} from './../../util.js';

/** @test {FunctionDoc#@_name} */
describe(fileNameToDescription(__filename, 'testExportAnonymousFunction'), function () {
  const $ = loadCheerio('function/index.html');
  const anonymousFunctions = $('[data-ice="summary"] [href*="#static-function-AnonymousFunction"]');
  expect( anonymousFunctions.length ).to.equal(2);

  it('has first anonymous function', function () {
    const firstParent = anonymousFunctions.eq(0).parents('[data-ice="target"]');
    expect( $('[data-ice="access"]', firstParent).html() ).to.equal('public');
    expect( $('[data-ice="name"] a', firstParent).html() ).to.equal('AnonymousFunction');
    expect( $('[data-ice="description"] p', firstParent).html() ).to.equal('This is another anonymous function to test multiple anonymous default exports.');
  });

  it('has second anonymous function', function () {
    const secondParent = anonymousFunctions.eq(1).parents('[data-ice="target"]');
    expect( $('[data-ice="access"]', secondParent).html() ).to.equal('public');
    expect( $('[data-ice="name"] a', secondParent).html() ).to.equal('AnonymousFunction');
    expect( $('[data-ice="description"] p', secondParent).html() ).to.equal('this is anonymous function.');
  });
});
