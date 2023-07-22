import collectjs from 'collect.js';
import { expect } from 'chai';

import { helper } from '../../helper.mjs';

describe(`esdoc generated data`, function() {
  const indexJSON = helper.loadJSONFile(helper.fixturePath, 'docs/index.json');
  
  it('contains what we expect', function() {
    expect(indexJSON.length).to.equal(88);
    
    const doc48 = collectjs(indexJSON)
      .where('__docId__', '===', 48)
      .firstOrFail();
    
    expect(doc48.kind).to.eql("file");
    expect(doc48.name).to.eql("src/DirectoryA/Identifier.js");

    const doc49 = collectjs(indexJSON)
      .where('__docId__', '===', 49)
      .firstOrFail();
    
    expect(doc49.importStyle).to.eql("{Identifier}");
    expect(doc49.description).to.eql("This Identifier class resides in DirectoryA");
    expect(doc49.longname).to.eql("src/DirectoryA/Identifier.js~Identifier");

    const doc52 = collectjs(indexJSON)
      .where('__docId__', '===', 52)
      .firstOrFail();

    expect(doc52.importStyle).to.eql("{Identifier}");
    expect(doc52.description).to.eql("This Identifier class resides in DirectoryB");
    expect(doc52.longname).to.eql("src/DirectoryB/Identifier.js~Identifier");
    
    const doc60 = collectjs(indexJSON)
      .where('__docId__', '===', 60)
      .firstOrFail();
    
    expect(doc60.access).to.eql('public');
    expect(doc60.description).to.eql("Creates instance.");
    expect(doc60.longname).to.eql("src/ESDocTest.js~ESDocTestSingleton#constructor");
  });
});
