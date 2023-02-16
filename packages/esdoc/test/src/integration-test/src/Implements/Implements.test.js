import assert from 'assert';
import {find} from '../../../../util';

describe('src/Implements/Implements:', function () {
  it('implements a interface', function () {
    const doc = find('longname', 'src/Implements/Implements.js~TestImplementsClass');
    assert.deepEqual(doc.implements, [
      'TestInterfaceInner',
      'TestInterfaceOuter', // todo: this is bug
    ]);
  });
});
