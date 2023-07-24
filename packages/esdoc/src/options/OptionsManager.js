import _ from 'lodash';
import upath from 'upath';

import { default as debugModule } from 'debug';
const debug = debugModule('ESDoc:OptionsManager');

import { InvalidOptionsSchemaDefinitionError, InvalidOptionsValueError, MissingOptionsValueError } from './OptionsManagerErrors.js';

/**
 * @typedef {Array<OptionsSchemaItem>} OptionsSchema
 */

export class AbstractSchemaDefinitionItem {
  constructor(name, type) {
    if(!_.isString(name)) {
      throw new InvalidOptionsSchemaDefinitionError(
        "schemaItem is missing 'name' property! Every SchemaDefinitionItem must define 'name' property and at least one doesn't have it. Check the schema.",
        null
      );
    }
    this.name = name;
    this.type = type;
  }
  
  setIsRequired(value = true) {
    if(!_.isBoolean(true)) throw new TypeError('Argument is not boolean!');
    this.isRequired = value;

    return this;
  }

  setIsNotRequired() {
    this.isRequired = false;

    return this;
  }
  
  setDefaultValue(value) {
    if(typeof value !== this.type) {
      throw new InvalidOptionsSchemaDefinitionError(
        `'${this.name}' has wrong defaultValue type! ${this.type} is expected, but ${typeof value} was encountered.`,
        null
      );
    }

    this.defaultValue = value;
    
    return this;
  }
}

/**
 * Represents an Item in Schema definition.
 * @example {
 *    name: "includes",
 *    alias: ["include"],
 *    type: "array",
 *    ofType: "path",
 *    isRequired: true
 * }
 * @typedef  {object} OptionsSchemaItem
 * @property {OptionsManager.SupportedSchemaItemTypes} type
 * @property {OptionsManager.SupportedSchemaArrayItemTypes|undefined} [ofType]
 * @property {string} name       - name of the option
 * @property {Array<string>|undefined} [alias]
 * @property {boolean|undefined} [isRequired]
 * @property {OptionsManager.SupportedSchemaItemTypes} [defaultValue]
 */

export class OptionsManager {
  /**
   * @type {'boolean'|'string'|'number'|'path'|'array'}
   */
  static SupportedSchemaItemTypes = ['boolean', 'string', 'number', 'path', 'array'];
  /**
   * @type {'boolean'|'string'|'number'|'path'}
   */
  static SupportedSchemaArrayItemTypes = ['boolean', 'string', 'number', 'path'];

  /**
   * Creates and initializes OptionsManager.
   */
  constructor() {
    /**
     * @type {Map<string, OptionsSchemaItem>}
     * @description Stores SchemaItems as key/value pair.
     */
    this.schemas = new Map();
  }
  
  /**
   * Registers `schema` by `name` for later use in options processing. If `name` already exists, old schema is overwritten.
   * @param {string} name - Name of schema.
   * @param {OptionsSchema} schema - OptionsSchema definition.
   * 
   * @throws {TypeError} If name is not a string.
   * @throws {InvalidOptionsSchemaDefinitionError} If schema is not valid.
   */
  registerOptionsSchema(name, schema) {
    if(!_.isString(name)) throw new TypeError('name must be a string!');
    this.#validateSchema_(schema);
    
    this.schemas.set(name, schema);
  }
  
  /**
   * Checks if single {SchemaItem} definition is valid.
   * @param {OptionsSchemaItem} schemaItem - Schema item definition to validate.
   * @param {OptionsSchema}     schema     - Full schema definition.
   * @throws {InvalidOptionsSchemaDefinitionError} If schema is invalid.
   */
  #validateSchemaItem_(schemaItem, schema) {
    debug.extend('validateSchemaItem', '#')('schemaItem: %O', schemaItem);
    
    // If schemaItem.type is 'array'
    if(schemaItem.type === 'array') {
      // schemaItem.ofType must exist
      if(!_.has(schemaItem, 'ofType'))
        throw new InvalidOptionsSchemaDefinitionError(
          `'${schemaItem.name}' is missing 'ofType' property. Array type must define 'ofType' property to specify the type of array's elements. Add 'ofType' property.`,
          schema,
          schemaItem
        );
      
      // schemaItem.ofType must also be one of array supported types
      if(this.SupportedSchemaArrayItemTypes.indexOf(schemaItem.ofType) === -1)
        throw new InvalidOptionsSchemaDefinitionError(
          `'${schemaItem.name}'.ofType has invalid value! Property 'ofType' must be one of the supported types: ${_.toString(this.SupportedSchemaArrayItemTypes)}.`,
          schema,
          schemaItem
        );
      
      // If schemaItem.defaultValue exists
      if(_.has(schemaItem, 'defaultValue')) {
        // It must be of an array type
        if(!_.isArray(schemaItem.defaultValue))
          throw new InvalidOptionsSchemaDefinitionError(
            `'${schemaItem.name}'.defaultValue has invalid type! Property 'defaultValue' must be an array, but ${typeof schemaItem.defaultValue} was encountered!`,
            schema,
            schemaItem
          );
        
        // Check that all elements of schemaItem.defaultValue are of correct type
        for(let element of schemaItem.defaultValue) {
          // SPECIAL CASE for 'path'
          if(schemaItem.ofType === 'path') {
            // Normalize it...
            try {
              element = upath.normalize(element);
              // Continue to next...
              continue;
            } catch (err) {
              if(err instanceof TypeError) {
                throw new InvalidOptionsSchemaDefinitionError(
                  `'${schemaItem.name}'.defaultValue array has invalid value! Since ofType is 'path', only strings are expected, but '${typeof element}' was encountered!`,
                  schema,
                  schemaItem
                );
              }
              throw err;
            }
          }
          // Rest of types...
          if(typeof element !== schemaItem.ofType)
            throw new InvalidOptionsSchemaDefinitionError(
              `'${schemaItem.name}'.defaultValue array has invalid value! Only elements of '${schemaItem.ofType}' are expected, but '${typeof element}' was encountered!`,
              schema,
              schemaItem
            );
        }
      }
    }

    // If schemaItem.defaultValue exists, check if type is correct
    if(_.has(schemaItem, 'defaultValue')) {
      // SPECIAL CASE for 'path'
      if(schemaItem.type === 'path') {
        try {
          schemaItem.defaultValue = upath.normalize(schemaItem.defaultValue);
        } catch(err) {
          if(err instanceof TypeError) {
            throw new InvalidOptionsSchemaDefinitionError(
              `'${schemaItem.name}'.defaultValue has invalid value! Since its type is 'path', defaultValue is expected to be a string, but '${typeof schemaItem.defaultValue}' was encountered!`,
              schema,
              schemaItem
            );
          }
          throw err;
        }
      } else if(schemaItem.type === 'array') {
        // schemaItem.defaultValue checks for 'array' were already done in schemaItem.type === 'array' section
      } else {
        // Rest of types...
        if(typeof schemaItem.defaultValue !== schemaItem.type)
          throw new InvalidOptionsSchemaDefinitionError(
            `'${schemaItem.name}.defaultValue has invalid value! A value of '${schemaItem.type}' is expected, but '${typeof schemaItem.defaultValue}' was encountered instead!`,
            schema,
            schemaItem
          );
      }
    }
  }
  
  /**
   * Performs check if `schema` is valid. Throws otherwise.
   * @param {OptionsSchema} schema - Full schema definition
   * @throws {InvalidOptionsSchemaDefinitionError} If schema is not valid.
   */
  #validateSchema_(schema) {
    debug.extend('validateSchema', '#')('schema: %O', schema);

    if(_.isEmpty(schema))
      throw new InvalidOptionsSchemaDefinitionError(
        'Schema seems to be empty. At least one SchemaItem must be defined.',
        schema,
      );
    
    if(!_.isArrayLikeObject(schema))
      throw new InvalidOptionsSchemaDefinitionError(
        'Schema is expected to be ArrayLike - iterable and accessible by index!',
        schema
      );

    for(const schemaItem of schema) {
      this.#validateSchemaItem_(schemaItem, schema);
    }
  }
  
  /**
   * Takes `schema` and performs validation of `optionsAsJSON` against the schema. If schema definition is not correct,
   * an {InvalidOptionsSchemaDefinitionError} is thrown. This means schema is not correct and options were not checked.
   * If schema is correct, then the options are processed and if they are valid are added into config object as properties.
   * If an option is found to not be valid according to schema, then an error is added to errors object and option is not
   * added to config object.
   * 
   * @param {Array} schema Options schema definition.
   * @param {JSON} optionsAsJSON Unprocessed options.
   * @throws {InvalidOptionsSchemaDefinitionError} When schema definition is not correct.
   * @returns {{errors:Array, config:{}, rawSchema, rawOptionsAsJSON}}
   */
  processOptions_(schema, optionsAsJSON) {
    const lDebug = debug.extend('processOptions()', '#');
    lDebug('schema: %O\noptionsAsJSON: %O', schema, optionsAsJSON);
    
    this.#validateSchema_(schema);
    // Schema should be deemed valid at this point, so we can use it to process options.
    
    if(_.isUndefined(optionsAsJSON) || _.isNull(optionsAsJSON)) throw new TypeError('optionsAsJSON must not be undefined or null');

    const returnValue = {
      errors: [],
      config: {},
      rawSchema: schema,
      rawOptionsAsJSON: optionsAsJSON,
    };
    
    for(const schemaItem of schema) {
      this.#processItem_({schemaItem, returnValue, optionsAsJSON});
    }

    lDebug('processed config: %O', returnValue.config);
    return returnValue;
  }
  
  /**
   * Checks whether option is valid against schemaItem - type is correct, value is present if required,
   * uses default value, etc. Throws on error.
   * @param {*} argsObj 
   * @throws {InvalidOptionsValueError} If options cannot be processed according to schemaItem.
   */
  #processItem_(argsObj) {
    debug.extend('processItem', '#')('args: %O', argsObj);
    
    const {schemaItem, returnValue, optionsAsJSON} = argsObj;
    
    // Load value from options object.
    debug.extend('processItem', '#')("trying to read '%s' from options...", schemaItem.name);
    let optionValue = optionsAsJSON[schemaItem.name];
    debug.extend('processItem', '#')("'%s' is '%O'.", schemaItem.name, optionValue);
    // If value is not found, check if schema defines default value for us...
    if(!optionValue) {
      debug.extend('processItem', '#')("'%s' not found.", schemaItem.name);
      if(schemaItem?.defaultValue) {
        debug.extend('processItem', '#')("It has default value, setting it to '%O'", schemaItem.defaultValue);
      }
      optionValue = schemaItem.defaultValue;
    }

    // If value is required, but doesn't have value at this point, we have an issue...
    if(!optionValue) {
      if(schemaItem.isRequired)
        throw new MissingOptionsValueError(
          `'${schemaItem.name}' [${schemaItem.type}] is required! It does not have a default value, so you must define it in your options.`,
          returnValue.rawSchema,
          schemaItem
        );
    }
    
    // If optionValue is expected to be an array, we need to check every element
    if(schemaItem.type === 'array') {
      // optionValue itself must be an array, of course...
      if(!_.isArrayLike(optionValue))
        throw new InvalidOptionsValueError(
          `'${schemaItem.name}' has wrong value! An ${schemaItem.type} of ${schemaItem.ofType} is expected.`
        );
      
      // Now check every element
      for(let iindex = 0; iindex < optionValue.length; iindex = iindex + 1) {
        // SPECIAL CASE 'path'
        if(schemaItem.ofType === 'path') {
          if(!_.isString(optionValue[iindex]))
            throw new InvalidOptionsValueError(
              `'${schemaItem.name}' array has invalid element! 'path' is expected to be a string, but ${typeof optionValue[iindex]} was encountered.`,
              returnValue.rawSchema,
              schemaItem
            );
          debug.extend('processItem>array')('%O -> %O', optionValue[iindex], upath.normalize(optionValue[iindex]));
          optionValue[iindex] = upath.normalize(optionValue[iindex]);
        } else {
          // Check element has correct type
          if(typeof optionValue[iindex] !== schemaItem.ofType) {
            // and throw on wrong
            throw new InvalidOptionsValueError(
              `'${schemaItem.name}' has element of wrong type! Only ${schemaItem.ofType}s are expected, but ${typeof optionValue[iindex]} was encountered`,
              returnValue.rawSchema,
              schemaItem
            );
          }
        }
      }
    }
    // optionValue is not array, still need to check its type
    else {
      // SPECIAL CASE 'path'
      if(schemaItem.type === 'path') {
        if(!_.isString(optionValue))
          throw new InvalidOptionsValueError(
            `'${schemaItem.name}' has invalid value! 'path' is expected to be a string, but ${typeof optionValue} was encountered.`,
            returnValue.rawSchema,
            schemaItem
          );
        optionValue = upath.normalize(optionValue);
      } else {
        // Check element has correct type
        if(typeValidators.getValidatorForType(schemaItem.type))
          throw new InvalidOptionsValueError(
            `'${schemaItem.name}' has wrong type! ${schemaItem.type} is expected, but ${typeof optionValue} was encountered.`,
            returnValue.rawSchema,
            schemaItem
          );
      }
    }

    // value processed successfully, add it to config object.
    returnValue.config[schemaItem.name] = optionValue;
  }
}
