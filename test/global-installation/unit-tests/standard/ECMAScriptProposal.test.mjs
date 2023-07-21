import collectjs from 'collect.js';
import { expect } from 'chai';

import { helper } from '../../helper.mjs';

describe('ecmascript-proposal plugin', function () {
  const indexJSON = helper.loadJSONFile(helper.fixturePath, 'docs/index.json');

  it('makes parser recognize proposal features', function () {
    const identifierWithDecorator = collectjs(indexJSON)
      .where('name', '===', 'supportsDecorators')
      .firstOrFail();
    const functionWithSpreadParam = collectjs(indexJSON)
      .where('name', '===', 'spreadIsRecognized')
      .firstOrFail();
    
    expect(identifierWithDecorator.decorators[0].name).to.be.equal('someDecorator');
    expect(functionWithSpreadParam.params[1].spread).to.be.equal(true);
  });
});
