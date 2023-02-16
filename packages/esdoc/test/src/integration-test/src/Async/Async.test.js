import assert from 'assert';
import {find} from '../../../../util';

describe('test/Async/Async:', function () {
  it('is async method', function () {
    const doc = find('longname', 'src/Async/Async.js~TestAsync#methodAsync');
    assert.equal(doc.async, true);
  });

  it('is async function', function () {
    const doc = find('longname', 'src/Async/Async.js~testAsyncFunction');
    assert.equal(doc.async, true);
  });
});
