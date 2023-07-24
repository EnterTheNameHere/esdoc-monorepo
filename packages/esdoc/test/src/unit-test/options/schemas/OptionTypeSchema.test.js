// import { expect } from 'chai';
// import { fileNameToDescription } from '../../../../util.js';

// import { InvalidOptionsSchemaDefinitionError, InvalidOptionsValueError } from '../../../../src/Util/Errors/OptionsManagerErrors.js';
// import { OptionItemSchema } from '../../../../src/Util/OptionItemSchema.js';

// const wrapperValidate = function(itemSchema) {
//   //console.log('%o, validate: %O', __filename, itemSchema);
//   new OptionItemSchema(itemSchema).validate();
// };

// describe(fileNameToDescription(__filename), function () {
//   describe('Schema validation', function () {
//     it('Throws error when name is wrong', function () {
//       // schemaItem is null - TypeError
//       let itemSchema = null;
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(TypeError, 'null');
      
//       // schemaItem is undefined - TypeError
//       itemSchema = itemSchema?.thisDoesNotExist;
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(TypeError, 'undefined');
      
//       // Now we should start getting InvalidOptionsSchemaDefinitionErrors
  
//       // 'name' is missing
//       itemSchema = {};
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "missing 'name'");
  
//       // 'name' is empty
//       itemSchema = { name: '' };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is empty");
  
//       // 'name' is multiple spaces
//       itemSchema = { name: '    ' };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is empty");
      
//       // 'name' is number
//       itemSchema = { name: 42 };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
  
//       // 'name' is null
//       itemSchema = { name: null };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
  
//       // 'name' is undefined
//       itemSchema = { name: null };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
  
//       // 'name' is object
//       itemSchema = { name: {name: 'a name?'} };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
  
//       // 'name' is array
//       itemSchema = { name: ['a name?'] };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
  
//       // 'name' is Symbol
//       itemSchema = { name: Symbol('name') };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
  
//       // 'name' is function with object
//       itemSchema = { name: function () { return 'name'; } };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
      
//       // 'name' is arrow function with object
//       itemSchema = { name: () => { return 'name'; } };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
//     });
    
//     it('Throws error when type is wrong', function() {
//       // type is missing
//       let itemSchema = { name: 'name' };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property is missing');
  
//       // type is undefined
//       itemSchema = { name: 'name', type: itemSchema?.type };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
  
//       // type is null
//       itemSchema = { name: 'name', type: null };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
  
//       // type is number
//       itemSchema = { name: 'name', type: 42 };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
      
//       // type is NaN
//       itemSchema = { name: 'name', type: Number.NaN };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
      
//       // type is Symbol
//       itemSchema = { name: 'name', type: Symbol('string') };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
      
//       // type is empty string
//       itemSchema = { name: 'name', type: '' };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
  
//       // type is whiteline character
//       itemSchema = { name: 'name', type: '\t' };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
      
//       // type is untrimmed
//       itemSchema = { name: 'name', type: ' string' };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
  
//       // type is object
//       itemSchema = { name: 'name', type: new String('boolean') };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
  
//       // type is function with object
//       itemSchema = { name: 'name', type: function () { return 'boolean'; } };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
  
//       // type is arrow function with object
//       itemSchema = { name: 'name', type: () => { return 'boolean'; } };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
//     });

//     it('Throws when isRequired is invalid', function () {
//       // isRequired is optional, so without it nothing should throw
//       let itemSchema = { name: 'name', type: 'boolean' };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.not.throw;
      
//       // isRequired cannot be string
//       itemSchema = { name: 'name', type: 'boolean', isRequired: 'true' };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.isRequired has invalid value');
  
//       // isRequired cannot be null
//       itemSchema = { name: 'name', type: 'boolean', isRequired: null };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.isRequired has invalid value');
  
//       // isRequired cannot be undefined
//       itemSchema = { name: 'name', type: 'boolean', isRequired: itemSchema?.isUndefined };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.isRequired has invalid value');
  
//       // isRequired cannot be object
//       itemSchema = { name: 'name', type: 'boolean', isRequired: new Boolean(true) };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.isRequired has invalid value');
  
//       // isRequired cannot be number
//       itemSchema = { name: 'name', type: 'boolean', isRequired: 1 };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.isRequired has invalid value');
  
//       // isRequired is function with object
//       itemSchema = { name: 'name', type: 'boolean', isRequired: function () { return true; } };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.isRequired has invalid value');
  
//       // isRequired is arrow function with object
//       itemSchema = { name: 'name', type: 'boolean', isRequired: () => { return true; } };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.isRequired has invalid value');
//     });

//     it('Throws when alias is invalid', function () {
//       // alias is optional, so nothing should throw if it's not present
//       let itemSchema = { name: 'name', type: 'boolean' };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.not.throw;
      
//       // alias is number
//       itemSchema = { name: 'name', type: 'boolean', alias: 42 };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string or an array of strings');
      
//       // alias is null
//       itemSchema = { name: 'name', type: 'boolean', alias: null };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string or an array of strings');
  
//       // alias is undefined
//       itemSchema = { name: 'name', type: 'boolean', alias: itemSchema?.thisDoesNotExist };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string or an array of strings');
      
//       // alias is object
//       itemSchema = { name: 'name', type: 'boolean', alias: new String('alias1') };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string or an array of strings');
  
//       // alias is empty string
//       itemSchema = { name: 'name', type: 'boolean', alias: '' };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! It contains empty string');
  
//       // alias is still empty after trimming
//       itemSchema = { name: 'name', type: 'boolean', alias: '\t \t' };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! It contains empty string');
      
//       // alias is empty array
//       itemSchema = { name: 'name', type: 'boolean', alias: [] };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! The array cannot be empty');
      
//       // alias is array of numbers
//       itemSchema = { name: 'name', type: 'boolean', alias: [42, 61] };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string value is expected');
  
//       // alias is array of mixed
//       itemSchema = { name: 'name', type: 'boolean', alias: ['alias1', true, NaN] };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string value is expected');
  
//       // alias is array with empty string
//       itemSchema = { name: 'name', type: 'boolean', alias: [''] };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! It contains empty string');
  
//       // alias is array with empty string after trimming
//       itemSchema = { name: 'name', type: 'boolean', alias: ['alias1', '\t  \t'] };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! It contains empty string');
      
//       // alias is array with object
//       itemSchema = { name: 'name', type: 'boolean', alias: [new String('alias1')] };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string value is expected');
  
//       // alias is function with object
//       itemSchema = { name: 'name', type: 'boolean', alias: function () { return 'alias1'; } };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string or an array of strings');
  
//       // alias is arrow function with object
//       itemSchema = { name: 'name', type: 'boolean', alias: () => { return 'alias1'; } };
//       expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string or an array of strings');
//     });

//     describe('Throws when defaultValue is invalid', function () {
//       it("for type 'boolean'", function () {
//         // defaultValue for boolean is undefined
//         let schemaItem = { name: 'name', type: 'boolean', defaultValue: schemaItem?.thisDoesNotExist };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
//         // defaultValue for boolean is null
//         schemaItem = { name: 'name', type: 'boolean', defaultValue: null };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
//         // defaultValue for boolean is object
//         schemaItem = { name: 'name', type: 'boolean', defaultValue: new Boolean(true) };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
//         // defaultValue for boolean is string
//         schemaItem = { name: 'name', type: 'boolean', defaultValue: 'true' };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
//         // defaultValue for boolean is number
//         schemaItem = { name: 'name', type: 'boolean', defaultValue: 1 };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
//         // defaultValue for boolean is array
//         schemaItem = { name: 'name', type: 'boolean', defaultValue: [true] };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
//         // defaultValue for boolean is function
//         schemaItem = { name: 'name', type: 'boolean', defaultValue: function () {return true;} };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
//         // defaultValue for boolean is arrow function
//         schemaItem = { name: 'name', type: 'boolean', defaultValue: () => {return true;} };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
//         // defaultValue for boolean is Symbol
//         schemaItem = { name: 'name', type: 'boolean', defaultValue: Symbol(true) };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
//       });
      
//       it("for type 'number'", function () {
//         // defaultValue for number is undefined
//         let schemaItem = { name: 'name', type: 'number', defaultValue: schemaItem?.thisDoesNotExist };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'number' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
//         // defaultValue for number is null
//         schemaItem = { name: 'name', type: 'number', defaultValue: null };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'number' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
//         // defaultValue for number is object
//         schemaItem = { name: 'name', type: 'number', defaultValue: new Number(42) };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'number' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
//         // defaultValue for number is string
//         schemaItem = { name: 'name', type: 'number', defaultValue: '42' };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'number' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
//         // defaultValue for number is boolean
//         schemaItem = { name: 'name', type: 'number', defaultValue: true };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'number' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
//         // defaultValue for number is array
//         schemaItem = { name: 'name', type: 'number', defaultValue: [42] };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'number' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
//         // defaultValue for boolean is function
//         schemaItem = { name: 'name', type: 'boolean', defaultValue: function () {return 42;} };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
//         // defaultValue for boolean is arrow function
//         schemaItem = { name: 'name', type: 'boolean', defaultValue: () => {return 42;} };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
//         // defaultValue for number is Symbol
//         schemaItem = { name: 'name', type: 'number', defaultValue: Symbol(42) };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'number' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
//       });
  
//       it("for type 'string'", function () {
//         // defaultValue for string is undefined
//         let schemaItem = { name: 'name', type: 'string', defaultValue: schemaItem?.thisDoesNotExist };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
//         // defaultValue for string is null
//         schemaItem = { name: 'name', type: 'string', defaultValue: null };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
//         // defaultValue for string is object
//         schemaItem = { name: 'name', type: 'string', defaultValue: new String('value') };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
//         // defaultValue for string is boolean
//         schemaItem = { name: 'name', type: 'string', defaultValue: true };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
//         // defaultValue for string is number
//         schemaItem = { name: 'name', type: 'string', defaultValue: 42 };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
//         // defaultValue for string is array
//         schemaItem = { name: 'name', type: 'string', defaultValue: ['value'] };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
//         // defaultValue for string is function
//         schemaItem = { name: 'name', type: 'string', defaultValue: function () {return 'value';} };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
//         // defaultValue for string is arrow function
//         schemaItem = { name: 'name', type: 'string', defaultValue: () => {return 'value';} };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
//         // defaultValue for string is Symbol
//         schemaItem = { name: 'name', type: 'string', defaultValue: Symbol('value') };
//         expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
//       });
//     });
//   });
// });
