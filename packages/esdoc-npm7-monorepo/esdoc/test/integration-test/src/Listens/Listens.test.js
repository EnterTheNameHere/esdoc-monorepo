import assert from 'assert';
import {find} from '../../util';

describe('test/Listens/Listens:', function () {
  it('listens events', function () {
    const doc = find('longname', 'src/Listens/Listens.js~TestListensClass#methodListens');
    assert.deepEqual(doc.listens, [
      {
        types: ['TestListensEvent1'],
        description: ''
      },
      {
        types: ['TestListensEvent2'],
        description: 'listens TestListensEvent2'
      }
    ]);
  });
});
