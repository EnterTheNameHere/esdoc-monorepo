import assert from 'assert';
import {find} from '../../util';

describe('test/Type/Type:', function () {
  it('has member type', function () {
    const doc = find('longname', 'src/Type/Type.js~TestType#member');
    assert.deepEqual(doc.type, {
      nullable: null,
      types: ['number'],
      spread: false,
      description: null
    });
  });

  it('has variable type', function () {
    const doc = find('longname', 'src/Type/Type.js~testTypeVariable');
    assert.deepEqual(doc.type, {
      nullable: null,
      types: ['number'],
      spread: false,
      description: null
    });
  });
});
