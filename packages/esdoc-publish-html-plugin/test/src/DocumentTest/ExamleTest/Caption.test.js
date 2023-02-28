import {readDoc, assert, fileNameToDescription} from './../../util.js';

/** @test {AbstractDoc#@example} */
describe(fileNameToDescription(__filename, 'TestExampleCaption'), function () {
  const doc = readDoc('class/src/Example/Caption.js~TestExampleCaption.html');

  describe('in self detail', function () {
    it('has caption of example.', function () {
      assert.includes(doc, '.self-detail [data-ice="exampleDoc"] [data-ice="exampleCaption"]', 'this is caption');
    });
  });
});
