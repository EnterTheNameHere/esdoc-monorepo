import assert from 'assert';
import {find} from '../../../util';

describe('test/Abstract/Abstract', function () {
  it('is abstract', function () {
    const doc = find('longname', 'src/Abstract/Abstract.js~TestAbstract#methodAbstract');
    assert.equal(doc.abstract, true);
  });
});
