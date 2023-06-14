import {expect} from 'chai';
import {fileNameToDescription} from '../../../util';

import {InvalidOptionsSchemaDefinitionError, OptionsManager} from '../../../../src/Util/OptionsManager';
import {SchemaArrayItemValidator} from '../../../../src/Util/SchemaArrayItemValidator';

const wrapper = function(itemSchema) {
  console.log('%o, validate: %O', __filename, itemSchema);
  new SchemaArrayItemValidator(itemSchema, {}, null, itemSchema).validate();
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
    // 'type' is missing
    let itemSchema = { name: 'name' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property is missing');
    
    // 'type' is undefined
    itemSchema = { name: 'name', type: itemSchema?.type };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
    
    // 'type' is null
    itemSchema = { name: 'name', type: null };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
    
    // 'type' is number
    itemSchema = { name: 'name', type: 42 };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
        
    // 'type' is Symbol
    itemSchema = { name: 'name', type: Symbol('array') };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
    
    // 'type' is empty string
    itemSchema = { name: 'name', type: '' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');

    // 'type' is whiteline character
    itemSchema = { name: 'name', type: '\t' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
    
    // 'type' is untrimmed
    itemSchema = { name: 'name', type: ' array' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
    
    // 'type' is object
    itemSchema = { name: 'name', type: new String('array') };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');

    // 'type' is function with object
    itemSchema = { name: 'name', type: function () { return 'array'; } };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
    
    // 'type' is arrow function with object
    itemSchema = { name: 'name', type: () => { return 'array'; } };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
    
    // 'ofType' is missing
    itemSchema = { name: 'name', type: 'array' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.ofType property is missing');
    
    // 'ofType' is undefined
    itemSchema = { name: 'name', type: 'array', ofType: itemSchema?.thisDoesNotExist };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.ofType property has an invalid value');

    // 'ofType' is null
    itemSchema = { name: 'name', type: 'array', ofType: null };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.ofType property has an invalid value');
    
    // 'ofType' is number
    itemSchema = { name: 'name', type: 'array', ofType: 42 };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.ofType property has an invalid value');
        
    // 'ofType' is Symbol
    itemSchema = { name: 'name', type: 'array', ofType: Symbol('array') };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.ofType property has an invalid value');
    
    // 'ofType' is empty string
    itemSchema = { name: 'name', type: 'array', ofType: '' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.ofType property has an invalid value');

    // 'ofType' is whiteline character
    itemSchema = { name: 'name', type: 'array', ofType: '\t' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.ofType property has an invalid value');
    
    // 'ofType' is untrimmed
    itemSchema = { name: 'name', type: 'array', ofType: ' array' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.ofType property has an invalid value');

    // 'ofType' is object
    itemSchema = { name: 'name', type: 'array', ofType: new String('array') };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.ofType property has an invalid value');

    // 'ofType' is function with object
    itemSchema = { name: 'name', type: 'array', ofType: function () { return 'array'; } };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.ofType property has an invalid value');
    
    // 'ofType' is arrow function with object
    itemSchema = { name: 'name', type: 'array', ofType: () => { return 'array'; } };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.ofType property has an invalid value');
  });

  it('Correctly throws error when default value is invalid', function () {
    // 'defaultValue' is optional, so it shouldn't throw anything without it being defined
    let itemSchema = { name: 'name', type: 'array', ofType: 'boolean' };
    expect(wrapper.bind(wrapper, itemSchema)).to.not.throw;
    
    // 'defaultValue' is null
    itemSchema = { name: 'name', type: 'array', ofType: 'boolean', defaultValue: null };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");
    
    // 'defaultValue' is undefined
    itemSchema = { name: 'name', type: 'array', ofType: 'boolean', defaultValue: itemSchema?.thisDoesNotExist };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");

    // 'defaultValue' is object
    itemSchema = { name: 'name', type: 'array', ofType: 'boolean', defaultValue: new String('array') };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");
    
    // 'defaultValue' is string
    itemSchema = { name: 'name', type: 'array', ofType: 'boolean', defaultValue: 'array' };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");
    
    // 'defaultValue' is number
    itemSchema = { name: 'name', type: 'array', ofType: 'boolean', defaultValue: 42 };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");
    
    // 'defaultValue' is boolean
    itemSchema = { name: 'name', type: 'array', ofType: 'boolean', defaultValue: true };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");
    
    // 'defaultValue' is symbol
    itemSchema = { name: 'name', type: 'array', ofType: 'boolean', defaultValue: Symbol('array') };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");
    
    // 'defaultValue' is function
    itemSchema = { name: 'name', type: 'array', ofType: 'boolean', defaultValue: function () {return ['array'];} };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");
    
    // 'defaultValue' is arrow function
    itemSchema = { name: 'name', type: 'array', ofType: 'boolean', defaultValue: () => {return ['array'];} };
    expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");

    for(const type of OptionsManager.SupportedSchemaArrayItemTypes) {
      // array with null element
      itemSchema = { name: 'name', type: 'array', ofType: type, defaultValue: [null] };
      expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");

      // array with undefined element
      itemSchema = { name: 'name', type: 'array', ofType: type, defaultValue: [itemSchema?.thisDoesNotExist] };
      expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");

      // array with object element
      itemSchema = { name: 'name', type: 'array', ofType: type, defaultValue: [new String('array')] };
      expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");
      
      // array with symbol element
      itemSchema = { name: 'name', type: 'array', ofType: type, defaultValue: [Symbol('array')] };
      expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");
      
      // array with function element
      itemSchema = { name: 'name', type: 'array', ofType: type, defaultValue: [function () {return ['array'];}] };
      expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");
      
      // array with arrow function element
      itemSchema = { name: 'name', type: 'array', ofType: type, defaultValue: [() => {return ['array'];}] };
      expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, ".defaultValue has invalid value! For type 'array'");
      
      // array with combination of allowed elements
      itemSchema = { name: 'name', type: 'array', ofType: type, defaultValue: ['string', 42, true] };
      expect(wrapper.bind(wrapper, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '');
    }
  });
});
