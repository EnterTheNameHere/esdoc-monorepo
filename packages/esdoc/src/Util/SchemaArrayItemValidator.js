import _ from 'lodash';
import { OptionsManager } from './OptionsManager.js';
import { InvalidOptionsSchemaDefinitionError } from './Errors/OptionsManagerErrors.js';
import { OptionItemSchema } from './SchemaItemValidator.js';


export class SchemaArrayItemValidator extends OptionItemSchema {
  validateType() {
    super.validateType(['array']);
    // Additionally, 'ofType' must be set too
    if(!_.hasIn(this._schemaItem, 'ofType')) {
      throw new InvalidOptionsSchemaDefinitionError(
        `'${this._schemaItem.name}'.ofType property is missing! ofType defines the type of array's elements. It's expected to be one of the supported values: ${_.toString(OptionsManager.SupportedSchemaArrayItemTypes)}.`,
        this._fullSchema,
        this._schemaItem
      );
    }

    // 'ofType' must be one of supported types for array elements
    if(OptionsManager.SupportedSchemaArrayItemTypes.indexOf(this._schemaItem.ofType) === -1) {
      throw new InvalidOptionsSchemaDefinitionError(
        `'${this._schemaItem.name}'.ofType property has an invalid value! Only one of the supported array's type is allowed: ${_.toString(OptionsManager.SupportedSchemaArrayItemTypes)}.`,
        this._fullSchema,
        this._schemaItem
      );
    }
  }

  validateDefaultValue() {
    // 'defaultValue' is optional, so check only if it's defined
    if(_.hasIn(this._schemaItem, 'defaultValue')) {
      // 'defaultValue' must be an array
      if(!_.isArray(this._schemaItem.defaultValue)) {
        throw new InvalidOptionsSchemaDefinitionError(
          `'${this._schemaItem.name}'.defaultValue property has an invalid value! Default value for type 'array' must be an array.`,
          this._fullSchema,
          this._schemaItem
        );
      }
      
      // 'defaultValue' can be empty
      
      // All elements of 'defaultValue' array must be of type defined in 'ofType'
      for(const arrayElement of this._schemaItem.defaultValue) {
        if(typeof arrayElement !== this._schemaItem.ofType) {
          throw new InvalidOptionsSchemaDefinitionError(
            `'${this._schemaItem.name}'.defaultValue array has invalid value in it! A ${this._schemaItem.ofType} is expected, but ${typeof arrayElement} was encountered.`,
            this._fullSchema,
            this._schemaItem
          );
        }
      }
    }
  }
}
