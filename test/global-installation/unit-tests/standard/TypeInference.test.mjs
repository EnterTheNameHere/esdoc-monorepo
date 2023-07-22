import collectjs from 'collect.js';
import { expect } from 'chai';

import { helper } from '../../helper.mjs';

describe('type-inference plugin', function () {
  const indexJSON = helper.loadJSONFile(helper.fixturePath, 'docs/index.json');

  it('infer return types as it should', function () {
    const returnsNumber = collectjs(indexJSON)
      .where('name', '===', 'returnsNumber')
      .firstOrFail();
    const returnsArrayOfStrings = collectjs(indexJSON)
      .where('name', '===', 'returnsArrayOfStrings')
      .firstOrFail();
    
    expect(returnsNumber.return.types).to.be.deep.equal(['number']);
    expect(returnsArrayOfStrings.return.types).to.be.deep.equal(['string[]']);
  });
});
