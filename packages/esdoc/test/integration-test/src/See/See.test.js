import assert from 'assert';
import {find} from '../../../util';

describe('test/See/See:', function () {
  it('has to see link', function () {
    const doc = find('longname', 'src/See/See.js~TestSeeClass');
    assert.deepEqual(doc.see, ['http://foo.example.com', 'http://bar.example.com']);
  });
});
