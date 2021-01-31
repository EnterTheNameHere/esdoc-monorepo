import {readDoc, assert} from './../util.js';

/** @test {IndexDocBuilder} */
describe('test index', function () {
  const doc = readDoc('index.html');

  it('has README.md', function () {
    assert.includes(doc, '[data-ice="index"]', 'this is ESDoc Test Fixture README.');
  });
});
