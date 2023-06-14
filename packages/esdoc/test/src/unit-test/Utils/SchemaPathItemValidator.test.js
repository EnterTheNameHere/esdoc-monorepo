import {expect} from 'chai';
import {fileNameToDescription} from '../../../util';

import {InvalidOptionsSchemaDefinitionError} from '../../../../src/Util/Errors/OptionsManagerErrors.js';
import { SchemaPathItemValidator } from '../../../../src/Util/SchemaPathItemValidator';

const wrapper = function(itemSchema) {
  console.log('%o, validate: %O', __filename, itemSchema);
  new SchemaPathItemValidator(itemSchema, {}, null, itemSchema).validate();
};

describe(fileNameToDescription(__filename), function () {
  it('Correctly throws error when name is wrong', function () {
    // schemaItem is null - TypeError
    let itemSchema = null;
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(TypeError, 'null');
    
    // schemaItem is undefined - TypeError
    itemSchema = itemSchema?.thisDoesNotExist;
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(TypeError, 'undefined');
    
    // Now we should start getting InvalidOptionsSchemaDefinitionErrors
    
    // 'name' is missing
    itemSchema = {};
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "missing 'name'");
    
    // 'name' is empty
    itemSchema = { name: '' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is empty");

    // 'name' is multiple spaces
    itemSchema = { name: '    ' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is empty");
    
    // 'name' is number
    itemSchema = { name: 42 };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
    
    // 'name' is null
    itemSchema = { name: null };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
    
    // 'name' is undefined
    itemSchema = { name: null };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");

    // 'name' is object
    itemSchema = { name: {name: 'a name?'} };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
    
    // 'name' is array
    itemSchema = { name: ['a name?'] };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");

    // 'name' is Symbol
    itemSchema = { name: Symbol('name') };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
    
    // 'name' is function with object
    itemSchema = { name: function () { return 'name'; } };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
    
    // 'name' is arrow function with object
    itemSchema = { name: () => { return 'name'; } };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
  });

  it('Correctly throws error when type is wrong', function() {
    // type is missing
    let itemSchema = { name: 'name' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property is missing');
    
    // type is undefined
    itemSchema = { name: 'name', type: itemSchema?.type };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');

    // type is null
    itemSchema = { name: 'name', type: null };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
    
    // type is number
    itemSchema = { name: 'name', type: 42 };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
        
    // type is Symbol
    itemSchema = { name: 'name', type: Symbol('path') };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
    
    // type is empty string
    itemSchema = { name: 'name', type: '' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');

    // type is whiteline character
    itemSchema = { name: 'name', type: '\t' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
    
    // type is untrimmed
    itemSchema = { name: 'name', type: ' path' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');

    // type is object
    itemSchema = { name: 'name', type: new String('path') };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');

    // type is function with object
    itemSchema = { name: 'name', type: function () { return 'path'; } };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
    
    // type is arrow function with object
    itemSchema = { name: 'name', type: () => { return 'path'; } };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
  });

  it('Correctly throws error when default value is invalid', function () {
    // 'defaultValue' is optional, so nothing should throw if it's not set
    let itemSchema = { name: 'name', type: 'path' };
    expect(wrapper.bind(wrapper, itemSchema)).to.not.throw;

    // 'defaultValue' is null
    itemSchema = { name: 'name', type: 'path', defaultValue: null };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'path'");

    // 'defaultValue' is undefined
    itemSchema = { name: 'name', type: 'path', defaultValue: itemSchema?.thisDoesNotExist };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'path'");

    // 'defaultValue' is object
    itemSchema = { name: 'name', type: 'path', defaultValue: new String('some path') };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'path'");

    // 'defaultValue' is array
    itemSchema = { name: 'name', type: 'path', defaultValue: ['some path'] };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'path'");
    
    // 'defaultValue' is number
    itemSchema = { name: 'name', type: 'path', defaultValue: 42 };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'path'");
    
    // 'defaultValue' is boolean
    itemSchema = { name: 'name', type: 'path', defaultValue: true };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'path'");
    
    // 'defaultValue' is symbol
    itemSchema = { name: 'name', type: 'path', defaultValue: Symbol('some path') };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'path'");
    
    // 'defaultValue' is function
    itemSchema = { name: 'name', type: 'path', defaultValue: function () {return 'some path';} };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'path'");
    
    // 'defaultValue' is arrow function
    itemSchema = { name: 'name', type: 'path', defaultValue: () => {return 'some path';} };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'path'");
  });
});
