import {readDoc, assert} from './../util.js';

/** @test {FileDocBuilder} */
describe('test source code file', function () {
  const doc = readDoc('file/src/Desc/Class.js.html');

  it('has source code.', function () {
    assert.includes(doc, 'body [data-ice="title"]', 'src/Desc/Class.js');
    assert.includes(doc, 'ol[data-ice="content"]', 'export default class TestDescClass {');
  });
});
