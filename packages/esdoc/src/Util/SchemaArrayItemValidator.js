import _ from 'lodash';
import { SchemaItemValidator } from './SchemaItemValidator';
import { InvalidOptionsSchemaDefinitionError, OptionsManager } from './OptionsManager';


export class SchemaArrayItemValidator extends SchemaItemValidator {
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
      

      // 'defaultValue' can be empty
      // All elements of 'defaultValue' array must be of type defined in 'ofType'

      throw new Error('Implement this!');
    }
  }
}
