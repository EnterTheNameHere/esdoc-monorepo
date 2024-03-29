import assert from 'assert';
import {find} from '../../../util';

describe('test/package.json:', function () {
  it('has package json', function () {
    const doc = find('longname', /[\\|/]package\.json$/u);
    const obj = JSON.parse(doc.content);
    assert.equal(obj.name, 'esdoc-test');
    assert.equal(obj.version, '1.2.3');
  });
});
