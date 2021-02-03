import assert from 'assert';
import fs from 'fs-extra';
import path from 'path';

describe('config outputAST:', function () {
  it('does not generate AST', function () {
    const outDir = fs.readdirSync(path.resolve(__dirname, '../../out'));
    assert(outDir.includes('ast') === false);
  });
});
