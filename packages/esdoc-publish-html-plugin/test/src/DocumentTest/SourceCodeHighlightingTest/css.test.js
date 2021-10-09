import fsextra from 'fs-extra';
import { assert } from '../../util'

describe('TestSourceCodeHighlighting', function () {
  describe('CSS', function () {
    it('tomorrow.css is successfully copied from highlight.js to html-template', function () {
      console.log('cwd', process.cwd())
      assert.equal( fsextra.existsSync('./out/html-template/css/tomorrow.css'), true, 'tomorrow.css was not copied into html-template from highlight.js styles directory!' );
    });
  });
})
