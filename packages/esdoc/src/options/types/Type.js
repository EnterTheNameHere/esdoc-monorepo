import _ from 'lodash';
import { InvalidOptionsSchemaDefinitionError } from '../OptionsManagerErrors.js';

export class Type {
  /**
   * @protected
   */
  _schemaItem = null;
  /**
   * @protected
   */
  _fullSchema = null;
  
  /**
   * Constructs new validator. The `schemaItem` parameter is required. Throws if 'name' property of schema definition
   * is invalid.
   * 
   * You can optionally pass object with full SchemaDefinition as `fullSchema`. This will then be included with
   * any thrown error object if validation or value processing ends with error.
   * 
   * @param {typeof _schemaItem} schemaItem 
   * @param {typeof _fullSchema} fullSchema
   * @throws {InvalidOptionsSchemaDefinitionError}
   */
  constructor(schemaItem, fullSchema = null) {
    this._schemaItem = schemaItem;
    this._fullSchema = fullSchema;
    
    if(_.isNull(this._schemaItem) || _.isUndefined(this._schemaItem)) {
      throw new TypeError('SchemaItem is either null or undefined. Valid SchemaItem is required!');
    }
  }
  
  /**
   * Validates if SchemaDefinition is valid. Throws when error is encountered during validation.
   * 
   * @public
   * @throws {InvalidOptionsSchemaDefinitionError}
   */
  validate() {
    this.validateName();
    this.validateType();
    this.validateAlias();
    this.validateIsRequired();
    this.validateDefaultValue();
  }
  
  /**
   * Validates if SchemaDefinition contains 'name' property. Throws if property is missing, is not string, or has wrong value.
   * 
   * @protected
   * @throws {InvalidOptionsSchemaDefinitionError}
   */
  validateName() {
    // 'name' is not optional, it must exist. And be a string...
    if(!_.hasIn(this._schemaItem, 'name')) {
      throw new InvalidOptionsSchemaDefinitionError(
        "SchemaItem is missing 'name' property! Every SchemaItem must have 'name'. The SchemaItem missing the 'name' property is called ... oh, yeah, nevermind. Don't worry, you can find it!",
        this._fullSchema,
        this._schemaItem
      );
    }

    // 'name' can only be a string primitive...
    if(_.isObjectLike(this._schemaItem.name) || !_.isString(this._schemaItem.name)) {
      throw new InvalidOptionsSchemaDefinitionError(
        `SchemaItem's property 'name' is ${typeof this._schemaItem.name} type. Only a string value is allowed as 'name'. Please use strings only for the 'name' property.`,
        this._fullSchema,
        this._schemaItem
      );
    }

    // 'name' cannot be empty. Perform trimming just to be sure...
    if(_.isEmpty(_.trim(this._schemaItem.name))) {
      throw new InvalidOptionsSchemaDefinitionError(
        "SchemaItem's property 'name' is empty! You must use a valid string for a SchemaItem's 'name' property. If you really tried using empty name, good try, but nope. Sorry.",
        this._fullSchema,
        this._schemaItem
      );
    }
  }
  
  /**
   * Validates if SchemaDefinition contains 'type' property. Throws if property is missing, is not string, or has wrong value.
   * @protected
   */
  validateType(customType = OptionsManager.SupportedSchemaItemTypes) {
    // Wrong use of function. Prevents mistakes when overriding in child classes...
    if(!_.isArray(customType)) {
      throw new TypeError('An array argument is required, like ["float"].');
    }

    // 'type' is not optional, it must exist.
    if(!_.hasIn(this._schemaItem, 'type')) {
      throw new InvalidOptionsSchemaDefinitionError(
        `'${this._schemaItem.name}'.type property is missing! 'type' must be defined as one of the supported types: ${this._schemaItem.name}.`,
        this._fullSchema,
        this._schemaItem
      );
    }

    // 'type' can be only one of supported types.
    if(OptionsManager.SupportedSchemaItemTypes.indexOf(this._schemaItem.type) === -1) {
      throw new InvalidOptionsSchemaDefinitionError(
        `'${this._schemaItem.name}'.type property has an invalid value! Only one of the supported types is expected: ${_.toString(this.SupportedSchemaArrayItemTypes)}.`,
        this._fullSchema,
        this._schemaItem
      );
    }
  }
  
  /**
   * Validates SchemaDefinition's 'alias' property, if it exists. Throws if alias' definition is invalid.
   * @protected
   */
  validateAlias() {
    // 'alias' is optional, so validate it only if it exists.
    if(_.hasIn(this._schemaItem, 'alias')) {
      // 'alias' might be just one string primitive - in such case turn it into a full array with that string as single element.
      if (_.isString(this._schemaItem.alias) && !_.isObjectLike(this._schemaItem.alias)) {
        this._schemaItem.alias = [this._schemaItem.alias];
      }

      // 'alias' must be array at this point
      if (!_.isArray(this._schemaItem.alias)) {
        throw new InvalidOptionsSchemaDefinitionError(
          `'${this._schemaItem.name}'.alias has invalid value! A string or an array of strings is expected, but ${typeof this._schemaItem.alias} was encountered.`,
          this._fullSchema,
          this._schemaItem
        );
      }

      // 'alias' array cannot be empty though
      if (this._schemaItem.alias.length === 0) {
        throw new InvalidOptionsSchemaDefinitionError(
          `'${this._schemaItem.name}'.alias has invalid value! The array cannot be empty. An array of strings is expected.`,
          this._fullSchema,
          this._schemaItem
        );
      }

      for (const singleAlias of this._schemaItem.alias) {
        // 'alias' elements can only be string primitive
        if (_.isObjectLike(singleAlias) || !_.isString(singleAlias)) {
          throw new InvalidOptionsSchemaDefinitionError(
            `'${this._schemaItem.name}'.alias has invalid value! A string value is expected, but ${typeof singleAlias} was encountered.`,
            this._fullSchema,
            this._schemaItem
          );
        }

        // 'alias' elements cannot contain empty string. Perform trimming just to be sure...
        if (_.isEmpty(_.trim(singleAlias))) {
          throw new InvalidOptionsSchemaDefinitionError(
            `'${this._schemaItem.name}'.alias has invalid value! It contains empty string. You must use a valid string, just like for 'name'.`,
            this._fullSchema,
            this._schemaItem
          );
        }
      }
    }
  }
  
  /**
   * @protected
   */
  validateIsRequired() {
    // 'isRequired' is optional, so validate it only if it exists.
    if(_.hasIn(this._schemaItem, 'isRequired')) {
      // 'isRequired' can be only boolean primitive
      if (_.isObjectLike(this._schemaItem.isRequired) || !_.isBoolean(this._schemaItem.isRequired)) {
        throw new InvalidOptionsSchemaDefinitionError(
          `'${this._schemaItem.name}'.isRequired has invalid value! A boolean value is expected, but ${typeof this._schemaItem.isRequired} was encountered.`,
          this._fullSchema,
          this._schemaItem
        );
      }
    }
  }
  
  /**
   * @protected
   */
  validateDefaultValue() {
    // 'defaultValue' is optional, so validate it only if it exists.
    if(_.hasIn(this._schemaItem, 'defaultValue')) {
      // 'defaultValue' must have same type as the one defined as 'type'
      if (typeof this._schemaItem.defaultValue !== this._schemaItem.type) {
        throw new InvalidOptionsSchemaDefinitionError(
          `'${this._schemaItem.name}'.defaultValue has invalid value! A value of '${this._schemaItem.type}' is expected, but '${typeof this._schemaItem.defaultValue}' was encountered instead!`,
          this._fullSchema,
          this._schemaItem
        );
      }
    }
  }
}
