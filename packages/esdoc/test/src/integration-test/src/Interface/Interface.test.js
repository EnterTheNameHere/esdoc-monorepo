import assert from 'assert';
import {find} from '../../../../util';

describe('test/Interface/Interface:', function () {
  it('is interface', function () {
    const doc = find('longname', 'src/Interface/Interface.js~TestInterfaceClass');
    assert.equal(doc.interface, true);
  });
});
