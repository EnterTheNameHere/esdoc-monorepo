import collectjs from 'collect.js';
import { expect } from 'chai';

import { helper } from '../../helper.mjs';

describe('accessor plugin', function () {
  const indexJSON = helper.loadJSONFile(helper.fixturePath, 'docs/index.json');

  it('adds ignore property to all private identifiers, since access is only "public", "protected"', function () {
    const privateIdentifiers = collectjs(indexJSON)
      .where('access', '===', 'private');
    
    for( let identifier of privateIdentifiers ) {
      expect(identifier).to.have.property('ignore').and.to.equal(true);
    }
  });
  
  it('privates all identifiers starting with underscore, since autoprivate is true', function () {
    let privateIdentifier = collectjs(indexJSON)
      .where('name', '===', '_staticMethodShouldBePrivate')
      .firstOrFail();
    expect(privateIdentifier).to.have.property('access').and.to.equal('private');

    privateIdentifier = collectjs(indexJSON)
      .where('name', '===', '_generatorMethodShouldBePrivate')
      .firstOrFail();
    expect(privateIdentifier).to.have.property('access').and.to.equal('private');

    privateIdentifier = collectjs(indexJSON)
      .where('name', '===', '_getterShouldBePrivate')
      .firstOrFail();
    expect(privateIdentifier).to.have.property('access').and.to.equal('private');

    privateIdentifier = collectjs(indexJSON)
      .where('name', '===', '_methodShouldBePrivate')
      .firstOrFail();
    expect(privateIdentifier).to.have.property('access').and.to.equal('private');

    privateIdentifier = collectjs(indexJSON)
      .where('name', '===', '_instanceShouldBePrivate')
      .firstOrFail();
    expect(privateIdentifier).to.have.property('access').and.to.equal('private');

    privateIdentifier = collectjs(indexJSON)
      .where('name', '===', '_shouldBePrivateStatic')
      .firstOrFail();
    expect(privateIdentifier).to.have.property('access').and.to.equal('private');
  });
});
