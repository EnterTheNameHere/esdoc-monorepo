import AbstractDoc from './AbstractDoc.js';

console.log('__filename', __filename, '__dirname', __dirname);

/**
 * Doc Class from Variable Declaration AST node.
 */
export default class VariableDoc extends AbstractDoc {
  /** specify ``variable`` to kind. */
  _$kind() {
    super._$kind();
    this._value.kind = 'variable';
  }

  /** set name by using self node. */
  _$name() {
    super._$name();

    const type = this._node.declarations[0].id.type;
    switch (type) {
      case 'Identifier':
        this._value.name = this._node.declarations[0].id.name;
        break;
      case 'ObjectPattern': {
        // HACK implementing multiple variables from object pattern. e.g. export const {a, b} = obj
        // Uses propertyIndex which was added to node to know which element to pick.
        const propertyIndex = this._node.propertyIndex;
        this._value.name = this._node.declarations[0].id.properties[propertyIndex].key.name;
      } break;
      case 'ArrayPattern': {
          // HACK implementing multiple variables from array pattern. e.g. export cont [a, b] = arr
          // Uses elementIndex which was added to node to know which element to pick.
          const elementIndex = this._node.elementIndex;
          this._value.name = this._node.declarations[0].id.elements[elementIndex].name;
      } break;
      default:
        throw new Error(`unknown declarations type: ${type}`);
    }
  }

  /** set memberof by using file path. */
  _$memberof() {
    super._$memberof();
    this._value.memberof = this._pathResolver.filePath;
  }
}
