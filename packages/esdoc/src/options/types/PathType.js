import _ from 'lodash';
import { Type } from './Type.js';
import { InvalidOptionsSchemaDefinitionError } from '../OptionsManagerErrors.js';


export class PathOptionTypeSchema extends Type {
  validateType() {
    super.validateType(['path']);
  }

  validateDefaultValue() {
    // 'defaultValue' is optional so check only if it is set
    if(_.hasIn(this._schemaItem, 'defaultValue')) {
      // path must be a string primitive
      if(!_.isString(this._schemaItem.defaultValue) || _.isObject(this._schemaItem.defaultValue)) {
        throw new InvalidOptionsSchemaDefinitionError(
          `'${this._schemaItem.name}'.defaultValue has invalid value! For type 'path', the defaultValue must be a string, but '${typeof this._schemaItem.defaultValue}' was encountered instead!`,
          this._fullSchema,
          this._schemaItem
        );
      }
    }
  }
}
