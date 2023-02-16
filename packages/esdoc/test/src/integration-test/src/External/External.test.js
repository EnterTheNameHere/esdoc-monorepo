import assert from 'assert';
import {find} from '../../../../util';

describe('test/External/External:', function () {
  it('is external', function () {
    const doc = find('longname', 'src/External/External.js~TestExternal');
    assert.equal(doc.externalLink, 'http://example.com');
  });
});
