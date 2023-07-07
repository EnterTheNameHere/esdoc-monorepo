/**
 * Thrown when ESDoc Options validation Schema definition is malformed.
 * {this#message} contains the error message.
 * {this#schema} is the full schema
 * {this#schemaItem} is the item in schema which is malformed.
 */
export class InvalidOptionsSchemaDefinitionError extends Error {
  constructor(message, schema, schemaItem = null) {
    super(message);
    this.name = this.constructor.name;
    this.schema = schema;
    this.schemaItem = schemaItem;
  }
}

export class InvalidOptionsValueError extends Error {
  constructor(message, schema, value) {
    super(message);
    this.name = this.constructor.name;
    this.schema = schema;
    this.value = value;
  }
}

export class MissingOptionsValueError extends Error {
  constructor(message, schema, value) {
    super(message);
    this.name = this.constructor.name;
    this.schema = schema;
    this.value = value;
  }
}
