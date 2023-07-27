import assert from 'assert';
import {find} from '../../../../util';

describe('test/Example/Example:', function () {
  it('has example', function () {
    const doc = find('longname', 'src/Example/Example.js~TestExample');
    assert.deepEqual(doc.examples, [
      'console.log(1)',
      '<caption>this is caption</caption>\nconsole.log(2)'
    ]);
  });
});
