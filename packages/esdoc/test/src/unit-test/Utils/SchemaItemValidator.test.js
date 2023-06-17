import { expect } from 'chai';
import { fileNameToDescription } from '../../../util.js';

import { InvalidOptionsSchemaDefinitionError, InvalidOptionsValueError } from '../../../../src/Util/Errors/OptionsManagerErrors.js';
import { SchemaItemValidator } from '../../../../src/Util/SchemaItemValidator.js';

const wrapperValidate = function(itemSchema) {
  //console.log('%o, validate: %O', __filename, itemSchema);
  new SchemaItemValidator(itemSchema).validate();
};

const wrapperProcessValue = function(itemSchema, value) {
  //console.log('%o, validate: %O', __filename, itemSchema);
  return new SchemaItemValidator(itemSchema).processValue(value);
};

describe(fileNameToDescription(__filename), function () {
  describe('Value processing', function () {
    it('Throws error if invalid object is passed as value', function () {
      const itemSchema = {
        name: 'booleanValue',
        type: 'boolean'
      };
      
      // Values which should throw error if passed to processValue function
      // value is null
      let value = null;
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // value is undefined
      value = itemSchema?.thisDoesNotExist;
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // value is Symbol
      value = Symbol('test');
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // value is NaN
      value = NaN;
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // value is array function
      value = () => { return true; };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // value is function
      value = function () { return true; };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // Intentional
      // eslint-disable-next-line no-new-func
      value = new Function('return true;');
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // value is array
      value = [];
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // value is boolean
      value = true;
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // value is number
      value = 42;
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // value is text
      value = 'text';
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // value is boolean object
      value = new Boolean(true);
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
    });
    
    it('Processes aliased values', function () {
      // Alias in SchemaItem means the value can be entered as either the 'name', or any of 'alias' names...
      // ProcessedValue should have all alias names and 'name', even if only one of them were provided...
      let itemSchema = { name: 'actualName', type: 'string', alias: ['secondName', 'alternativeName'] };
      let value = { actualName: 'this is the value' };
      let result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty('actualName');
      expect(result.processedValue).to.haveOwnProperty('secondName');
      expect(result.processedValue).to.haveOwnProperty('alternativeName');
      expect(result.processedValue.actualName).to.deep.equal('this is the value');
      expect(result.processedValue.secondName).to.deep.equal('this is the value');
      expect(result.processedValue.alternativeName).to.deep.equal('this is the value');

      value = { secondName: 'this is the value, different name' };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty('actualName');
      expect(result.processedValue).to.haveOwnProperty('secondName');
      expect(result.processedValue).to.haveOwnProperty('alternativeName');
      expect(result.processedValue.actualName).to.deep.equal('this is the value, different name');
      expect(result.processedValue.secondName).to.deep.equal('this is the value, different name');
      expect(result.processedValue.alternativeName).to.deep.equal('this is the value, different name');
      
      value = { alternativeName: 'again value, this time again as another alias' };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty('actualName');
      expect(result.processedValue).to.haveOwnProperty('secondName');
      expect(result.processedValue).to.haveOwnProperty('alternativeName');
      expect(result.processedValue.actualName).to.deep.equal('again value, this time again as another alias');
      expect(result.processedValue.secondName).to.deep.equal('again value, this time again as another alias');
      expect(result.processedValue.alternativeName).to.deep.equal('again value, this time again as another alias');
      
      
      
      itemSchema = { name: 'booleanName', type: 'boolean', alias: ['aliasedName', 'aliasedBooleanName'] };
      value = { booleanName: true };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty('booleanName');
      expect(result.processedValue).to.haveOwnProperty('aliasedName');
      expect(result.processedValue).to.haveOwnProperty('aliasedBooleanName');
      expect(result.processedValue.booleanName).to.equal(true);
      expect(result.processedValue.aliasedName).to.equal(true);
      expect(result.processedValue.aliasedBooleanName).to.equal(true);

      value = { aliasedName: true };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty('booleanName');
      expect(result.processedValue).to.haveOwnProperty('aliasedName');
      expect(result.processedValue).to.haveOwnProperty('aliasedBooleanName');
      expect(result.processedValue.booleanName).to.equal(true);
      expect(result.processedValue.aliasedName).to.equal(true);
      expect(result.processedValue.aliasedBooleanName).to.equal(true);

      value = { isBooleanName: true };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty('booleanName');
      expect(result.processedValue).to.haveOwnProperty('aliasedName');
      expect(result.processedValue).to.haveOwnProperty('aliasedBooleanName');
      expect(result.processedValue.booleanName).to.equal(true);
      expect(result.processedValue.aliasedName).to.equal(true);
      expect(result.processedValue.aliasedBooleanName).to.equal(true);



      itemSchema = { name: 'luckyNumber', type: 'number', alias: ['aliasForLuckyNumber', 'isLucky'] };
      value = { luckyNumber: 42 };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty('luckyNumber');
      expect(result.processedValue).to.haveOwnProperty('aliasForLuckyNumber');
      expect(result.processedValue).to.haveOwnProperty('isLucky');
      expect(result.processedValue.luckyNumber).to.equal(42);
      expect(result.processedValue.aliasForLuckyNumber).to.equal(42);
      expect(result.processedValue.isLucky).to.equal(42);

      value = { aliasForLuckyNumber: 42 };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty('luckyNumber');
      expect(result.processedValue).to.haveOwnProperty('aliasForLuckyNumber');
      expect(result.processedValue).to.haveOwnProperty('isLucky');
      expect(result.processedValue.luckyNumber).to.equal(0x2A);
      expect(result.processedValue.aliasForLuckyNumber).to.equal(0b00101010);
      expect(result.processedValue.isLucky).to.equal(42);

      value = { isBooleanName: -1 };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty('luckyNumber');
      expect(result.processedValue).to.haveOwnProperty('aliasForLuckyNumber');
      expect(result.processedValue).to.haveOwnProperty('isLucky');
      expect(result.processedValue.luckyNumber).to.equal(-1);
      expect(result.processedValue.aliasForLuckyNumber).to.equal(-1);
      expect(result.processedValue.isLucky).to.equal(-1);

      // ProcessedValue aliased properties should be references, so if you change one, it will change all of them...
      itemSchema = { name: 'firstName', type: 'string', alias: ['secondName', 'thirdName'] };
      value = { firstName: 'the value' };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty('firstName');
      expect(result.processedValue).to.haveOwnProperty('secondName');
      expect(result.processedValue).to.haveOwnProperty('thirdName');
      expect(result.processedValue.firstName).to.equal(result.processedValue.secondName);
      expect(result.processedValue.secondName).to.equal(result.processedValue.thirdName);
      expect(result.processedValue.thirdName).to.equal(result.processedValue.booleanName);
      expect(result.processedValue.firstName).to.not.equal('the value'); // Not the same reference
      expect(result.processedValue.firstName).to.deep.equal('the value'); // Comparing values, not references
      
      result.processedValue.firstName = 'different value'; // Let's change the value
      expect(result.processedValue.firstName).to.equal(result.processedValue.secondName);
      expect(result.processedValue.secondName).to.equal(result.processedValue.thirdName);
      expect(result.processedValue.thirdName).to.equal(result.processedValue.booleanName);
      expect(result.processedValue.firstName).to.not.equal('different value'); // Not the same reference
      expect(result.processedValue.firstName).to.deep.equal('different value'); // Comparing values, not references
      
      // If multiple values are provided under different aliased names, error should be thrown...
      itemSchema = { name: 'one', type: 'string', alias: ['two', 'three'] };
      value = { one: 'the value', two: 'second value' };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { one: 'the value', three: 'another value' };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);

      value = { one: 'the value', two: 'second value', three: 'another value' };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { two: 'second value', three: 'another value' };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);

      // Even if values are same...
      value = { one: 'the value', two: 'the value' };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { one: 'the value', three: 'the value' };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);

      value = { one: 'the value', two: 'the value', three: 'the value' };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { two: 'the value', three: 'the value' };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);

      // No value but SchemaItem provides default value
      itemSchema = { name: 'uno', type: 'string', alias: ['dos', 'tres'], defaultValue: 'cuatro' };
      value = {};
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty('uno');
      expect(result.processedValue).to.haveOwnProperty('dos');
      expect(result.processedValue).to.haveOwnProperty('tres');
      expect(result.processedValue.uno).to.equal(result.processedValue.dos);
      expect(result.processedValue.dos).to.equal(result.processedValue.tres);
      expect(result.processedValue.tres).to.equal(result.processedValue.uno);
      expect(result.processedValue.firstName).to.not.equal('cuatro'); // Not the same reference
      expect(result.processedValue.firstName).to.deep.equal('cuatro'); // Comparing values, not references

      // Value is not overridden by default value
      itemSchema = { name: 'eins', type: 'number', alias: ['zwei', 'drei'], defaultValue: 44 };
      value = { drei: 42 };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty('eins');
      expect(result.processedValue).to.haveOwnProperty('zwei');
      expect(result.processedValue).to.haveOwnProperty('drei');
      expect(result.processedValue.eins).to.equal(42);
      expect(result.processedValue.zwei).to.equal(42);
      expect(result.processedValue.drei).to.equal(42);
    });

    it('Processes required values', function () {
      // We pass empty OptionValue object to SchemaItem which requires value to exist...
      let value = {};
      let itemSchema = { name: 'requiredBooleanValue', type: 'boolean', isRequired: true };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      itemSchema = { name: 'requiredNumberValue', type: 'number', isRequired: true };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);

      itemSchema = { name: 'requiredStringValue', type: 'string', isRequired: true };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // We have object, but it doesn't have the required value...
      value = { notThatValue: 42 };
      itemSchema = { name: 'requiredBooleanValue', type: 'boolean', isRequired: true };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { someOtherProperty: 'this' };
      itemSchema = { name: 'requiredNumberValue', type: 'number', isRequired: true };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { thisIsNotItEither: true };
      itemSchema = { name: 'requiredStringValue', type: 'string', isRequired: true };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // We pass empty object, but this time SchemaItem has default value for us...
      value = {};
      itemSchema = { name: 'requiredBooleanValue', type: 'boolean', isRequired: true, defaultValue: true };
      let result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.equal(true);

      value = {};
      itemSchema = { name: 'requiredNumberValue', type: 'number', isRequired: true, defaultValue: 42 };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.equal(42);

      value = {};
      itemSchema = { name: 'requiredStringValue', type: 'string', isRequired: true, defaultValue: 'a value' };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.deep.equal('a value');
      
      // Value provided by user shouldn't be overridden by default value
      value = { requiredBooleanValue: false };
      itemSchema = { name: 'requiredBooleanValue', type: 'boolean', isRequired: true, defaultValue: true };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.equal(false);

      value = { requiredNumberValue: -1 };
      itemSchema = { name: 'requiredNumberValue', type: 'number', isRequired: true, defaultValue: 42 };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.equal(-1);

      value = { requiredStringValue: 'nope' };
      itemSchema = { name: 'requiredStringValue', type: 'string', isRequired: true, defaultValue: 'a value' };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.deep.equal('nope');
    });
    
    it('Processes boolean value', function () {
      // Throws error is value is not correct type. No implicit conversions.
      let itemSchema = { name: 'invalidBooleanValue', type: 'boolean' };
      let value = { invalidNumberValue: 'a string' };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidBooleanValue: 42 };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidBooleanValue: [] };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidBooleanValue: [true] };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);

      value = { invalidBooleanValue: Symbol(true) };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);

      value = { invalidBooleanValue: () => { return true; } };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidBooleanValue: function () { return true; } };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);

      value = { invalidBooleanValue: {} };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidBooleanValue: null };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidBooleanValue: itemSchema?.thisDoesNotExist };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // Intended
      // eslint-disable-next-line no-new-func
      value = { invalidBooleanValue: new Function('return true;') };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);

      value = { invalidBooleanValue: new Boolean(true) };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      


      // Now valid values
      itemSchema = { name: 'booleanValue', type: 'boolean' };
      value = { booleanValue: true };
      let result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.equal(value[itemSchema.name]);
      
      value = { booleanValue: Boolean('true') };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.equal(value[itemSchema.name]);
      
      const otherVariable = true;
      value = { booleanValue: Boolean(otherVariable) };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.equal(value[itemSchema.name]);
    });

    it('Processes number value', function () {
      // Throws error is value is not correct type. No implicit conversions.
      let itemSchema = { name: 'invalidNumberValue', type: 'number' };
      let value = { invalidNumberValue: 'a string' };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidNumberValue: true };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidNumberValue: [] };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidNumberValue: [42] };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);

      value = { invalidNumberValue: Symbol(42) };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);

      value = { invalidNumberValue: () => { return 42; } };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidNumberValue: function () { return 42; } };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidNumberValue: {} };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidNumberValue: null };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidNumberValue: itemSchema?.thisDoesNotExist };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // Intended
      // eslint-disable-next-line no-new-func
      value = { invalidNumberValue: new Function('return 42;') };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);

      value = { invalidNumberValue: new Number(42) };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      
      
      // Now valid values
      itemSchema = { name: 'numberValue', type: 'number' };
      value = { numberValue: 42 };
      let result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.equal(value[itemSchema.name]);
      
      value = { numberValue: Number('42') };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.equal(value[itemSchema.name]);
      
      const otherVariable = 42;
      value = { numberValue: Boolean(otherVariable) };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.equal(value[itemSchema.name]);
    });
    
    it('Processes string value', function () {
      // Throws error is value is not correct type. No implicit conversions.
      let itemSchema = { name: 'invalidStringValue', type: 'string' };
      let value = { invalidStringValue: true };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidStringValue: [] };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidStringValue: ['a string'] };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);

      value = { invalidStringValue: Symbol('a string') };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);

      value = { invalidStringValue: () => { return 'a string'; } };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidStringValue: function () { return 'a string'; } };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidStringValue: {} };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidStringValue: null };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidStringValue: itemSchema?.thisDoesNotExist };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      // Intended
      // eslint-disable-next-line no-new-func
      value = { invalidStringValue: new Function('return "a string";') };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      value = { invalidStringValue: new String('a string') };
      expect(wrapperProcessValue.bind(wrapperProcessValue, itemSchema, value)).to.throw(InvalidOptionsValueError);
      
      
      
      // Now valid values
      itemSchema = { name: 'stringValue', type: 'string' };
      value = { stringValue: 'a string' };
      let result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.deep.equal(value[itemSchema.name]);
      
      value = { stringValue: String('a string') };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.deep.equal(value[itemSchema.name]);
      
      const otherVariable = 'a string';
      value = { stringValue: String(otherVariable) };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.deep.equal(value[itemSchema.name]);
      
      // Empty string is valid value
      value = { stringValue: '' };
      result = wrapperProcessValue(itemSchema, value);
      expect(result).to.haveOwnProperty('processedValue');
      expect(result.processedValue).to.haveOwnProperty(itemSchema.name);
      expect(result.processedValue[itemSchema.name]).to.deep.equal(value[itemSchema.name]);
    });
  });

  describe('Schema validation', function () {
    it('Throws error when name is wrong', function () {
      // schemaItem is null - TypeError
      let itemSchema = null;
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(TypeError, 'null');
      
      // schemaItem is undefined - TypeError
      itemSchema = itemSchema?.thisDoesNotExist;
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(TypeError, 'undefined');
      
      // Now we should start getting InvalidOptionsSchemaDefinitionErrors
  
      // 'name' is missing
      itemSchema = {};
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "missing 'name'");
  
      // 'name' is empty
      itemSchema = { name: '' };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is empty");
  
      // 'name' is multiple spaces
      itemSchema = { name: '    ' };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is empty");
      
      // 'name' is number
      itemSchema = { name: 42 };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
  
      // 'name' is null
      itemSchema = { name: null };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
  
      // 'name' is undefined
      itemSchema = { name: null };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
  
      // 'name' is object
      itemSchema = { name: {name: 'a name?'} };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
  
      // 'name' is array
      itemSchema = { name: ['a name?'] };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
  
      // 'name' is Symbol
      itemSchema = { name: Symbol('name') };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
  
      // 'name' is function with object
      itemSchema = { name: function () { return 'name'; } };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
      
      // 'name' is arrow function with object
      itemSchema = { name: () => { return 'name'; } };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, "property 'name' is");
    });

    it('Throws error when type is wrong', function() {
      // type is missing
      let itemSchema = { name: 'name' };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property is missing');
  
      // type is undefined
      itemSchema = { name: 'name', type: itemSchema?.type };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
  
      // type is null
      itemSchema = { name: 'name', type: null };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
  
      // type is number
      itemSchema = { name: 'name', type: 42 };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
      
      // type is NaN
      itemSchema = { name: 'name', type: Number.NaN };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
      
      // type is Symbol
      itemSchema = { name: 'name', type: Symbol('string') };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
      
      // type is empty string
      itemSchema = { name: 'name', type: '' };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
  
      // type is whiteline character
      itemSchema = { name: 'name', type: '\t' };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
      
      // type is untrimmed
      itemSchema = { name: 'name', type: ' string' };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
  
      // type is object
      itemSchema = { name: 'name', type: new String('boolean') };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
  
      // type is function with object
      itemSchema = { name: 'name', type: function () { return 'boolean'; } };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
  
      // type is arrow function with object
      itemSchema = { name: 'name', type: () => { return 'boolean'; } };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.type property has an invalid value');
    });

    it('Throws when isRequired is invalid', function () {
      // isRequired is optional, so without it nothing should throw
      let itemSchema = { name: 'name', type: 'boolean' };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.not.throw;
      
      // isRequired cannot be string
      itemSchema = { name: 'name', type: 'boolean', isRequired: 'true' };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.isRequired has invalid value');
  
      // isRequired cannot be null
      itemSchema = { name: 'name', type: 'boolean', isRequired: null };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.isRequired has invalid value');
  
      // isRequired cannot be undefined
      itemSchema = { name: 'name', type: 'boolean', isRequired: itemSchema?.isUndefined };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.isRequired has invalid value');
  
      // isRequired cannot be object
      itemSchema = { name: 'name', type: 'boolean', isRequired: new Boolean(true) };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.isRequired has invalid value');
  
      // isRequired cannot be number
      itemSchema = { name: 'name', type: 'boolean', isRequired: 1 };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.isRequired has invalid value');
  
      // isRequired is function with object
      itemSchema = { name: 'name', type: 'boolean', isRequired: function () { return true; } };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.isRequired has invalid value');
  
      // isRequired is arrow function with object
      itemSchema = { name: 'name', type: 'boolean', isRequired: () => { return true; } };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.isRequired has invalid value');
    });

    it('Throws when alias is invalid', function () {
      // alias is optional, so nothing should throw if it's not present
      let itemSchema = { name: 'name', type: 'boolean' };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.not.throw;
      
      // alias is number
      itemSchema = { name: 'name', type: 'boolean', alias: 42 };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string or an array of strings');
      
      // alias is null
      itemSchema = { name: 'name', type: 'boolean', alias: null };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string or an array of strings');
  
      // alias is undefined
      itemSchema = { name: 'name', type: 'boolean', alias: itemSchema?.thisDoesNotExist };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string or an array of strings');
      
      // alias is object
      itemSchema = { name: 'name', type: 'boolean', alias: new String('alias1') };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string or an array of strings');
  
      // alias is empty string
      itemSchema = { name: 'name', type: 'boolean', alias: '' };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! It contains empty string');
  
      // alias is still empty after trimming
      itemSchema = { name: 'name', type: 'boolean', alias: '\t \t' };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! It contains empty string');
      
      // alias is empty array
      itemSchema = { name: 'name', type: 'boolean', alias: [] };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! The array cannot be empty');
      
      // alias is array of numbers
      itemSchema = { name: 'name', type: 'boolean', alias: [42, 61] };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string value is expected');
  
      // alias is array of mixed
      itemSchema = { name: 'name', type: 'boolean', alias: ['alias1', true, NaN] };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string value is expected');
  
      // alias is array with empty string
      itemSchema = { name: 'name', type: 'boolean', alias: [''] };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! It contains empty string');
  
      // alias is array with empty string after trimming
      itemSchema = { name: 'name', type: 'boolean', alias: ['alias1', '\t  \t'] };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! It contains empty string');
      
      // alias is array with object
      itemSchema = { name: 'name', type: 'boolean', alias: [new String('alias1')] };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string value is expected');
  
      // alias is function with object
      itemSchema = { name: 'name', type: 'boolean', alias: function () { return 'alias1'; } };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string or an array of strings');
  
      // alias is arrow function with object
      itemSchema = { name: 'name', type: 'boolean', alias: () => { return 'alias1'; } };
      expect(wrapperValidate.bind(wrapperValidate, itemSchema)).to.throw(InvalidOptionsSchemaDefinitionError, '.alias has invalid value! A string or an array of strings');
    });

    describe('Throws when defaultValue is invalid', function () {
      it("for type 'boolean'", function () {
        // defaultValue for boolean is undefined
        let schemaItem = { name: 'name', type: 'boolean', defaultValue: schemaItem?.thisDoesNotExist };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
        // defaultValue for boolean is null
        schemaItem = { name: 'name', type: 'boolean', defaultValue: null };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
        // defaultValue for boolean is object
        schemaItem = { name: 'name', type: 'boolean', defaultValue: new Boolean(true) };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
        // defaultValue for boolean is string
        schemaItem = { name: 'name', type: 'boolean', defaultValue: 'true' };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
        // defaultValue for boolean is number
        schemaItem = { name: 'name', type: 'boolean', defaultValue: 1 };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
        // defaultValue for boolean is array
        schemaItem = { name: 'name', type: 'boolean', defaultValue: [true] };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
        // defaultValue for boolean is function
        schemaItem = { name: 'name', type: 'boolean', defaultValue: function () {return true;} };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
        // defaultValue for boolean is arrow function
        schemaItem = { name: 'name', type: 'boolean', defaultValue: () => {return true;} };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
        // defaultValue for boolean is Symbol
        schemaItem = { name: 'name', type: 'boolean', defaultValue: Symbol(true) };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
      });
      
      it("for type 'number'", function () {
        // defaultValue for number is undefined
        let schemaItem = { name: 'name', type: 'number', defaultValue: schemaItem?.thisDoesNotExist };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'number' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
        // defaultValue for number is null
        schemaItem = { name: 'name', type: 'number', defaultValue: null };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'number' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
        // defaultValue for number is object
        schemaItem = { name: 'name', type: 'number', defaultValue: new Number(42) };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'number' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
        // defaultValue for number is string
        schemaItem = { name: 'name', type: 'number', defaultValue: '42' };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'number' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
        // defaultValue for number is boolean
        schemaItem = { name: 'name', type: 'number', defaultValue: true };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'number' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
        // defaultValue for number is array
        schemaItem = { name: 'name', type: 'number', defaultValue: [42] };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'number' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
        // defaultValue for boolean is function
        schemaItem = { name: 'name', type: 'boolean', defaultValue: function () {return 42;} };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
        // defaultValue for boolean is arrow function
        schemaItem = { name: 'name', type: 'boolean', defaultValue: () => {return 42;} };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'boolean' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
        // defaultValue for number is Symbol
        schemaItem = { name: 'name', type: 'number', defaultValue: Symbol(42) };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'number' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
      });
  
      it("for type 'string'", function () {
        // defaultValue for string is undefined
        let schemaItem = { name: 'name', type: 'string', defaultValue: schemaItem?.thisDoesNotExist };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
        // defaultValue for string is null
        schemaItem = { name: 'name', type: 'string', defaultValue: null };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
        // defaultValue for string is object
        schemaItem = { name: 'name', type: 'string', defaultValue: new String('value') };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
        // defaultValue for string is boolean
        schemaItem = { name: 'name', type: 'string', defaultValue: true };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
        // defaultValue for string is number
        schemaItem = { name: 'name', type: 'string', defaultValue: 42 };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
        // defaultValue for string is array
        schemaItem = { name: 'name', type: 'string', defaultValue: ['value'] };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
        
        // defaultValue for string is function
        schemaItem = { name: 'name', type: 'string', defaultValue: function () {return 'value';} };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
        // defaultValue for string is arrow function
        schemaItem = { name: 'name', type: 'string', defaultValue: () => {return 'value';} };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
  
        // defaultValue for string is Symbol
        schemaItem = { name: 'name', type: 'string', defaultValue: Symbol('value') };
        expect(wrapperValidate.bind(wrapperValidate, schemaItem)).to.throw(InvalidOptionsSchemaDefinitionError, `value of 'string' is expected, but '${typeof schemaItem.defaultValue}' was encountered`);
      });
    });
  });
});
