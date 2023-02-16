import assert from 'assert';
import InvalidCodeLogger from '../../../../../out/Util/InvalidCodeLogger';

describe('test/_Misc/InvalidSyntax:', function () {
  it('is invalid', function () {
    assert.equal(InvalidCodeLogger._logs.length, 2);

    assert(InvalidCodeLogger._logs[0].filePath.match(/test[\\|/]integration-test[\\|/]src[\\|/]_Misc[\\|/]InvalidSyntaxCode.js/u));
    assert.deepEqual(InvalidCodeLogger._logs[0].log, [1, 2]);

    assert(InvalidCodeLogger._logs[1].filePath.match(/test[\\|/]integration-test[\\|/]src[\\|/]_Misc[\\|/]InvalidSyntaxDoc.js/u));
    assert.deepEqual(InvalidCodeLogger._logs[1].log, [1, 4]);
  });
});
