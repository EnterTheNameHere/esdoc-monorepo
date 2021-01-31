import assert from 'assert';
import {find} from '../../util';

describe('test/Link/Link:', function () {
  it('has link', function () {
    const doc = find('longname', 'src/Link/Link.js~TestLinkClass');
    assert.equal(doc.description, '{@link TestLinkClass}');
  });
});
