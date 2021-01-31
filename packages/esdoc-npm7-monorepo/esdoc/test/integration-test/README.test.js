import assert from 'assert';
import {find, file} from './util';

describe('test/README.md', function () {
  it('has README', function () {
    const doc = find('longname', /[\\||\/]README.md$/);
    assert.equal(doc.kind, 'index');
    assert.equal(doc.content, file(doc.longname));
  });
});
