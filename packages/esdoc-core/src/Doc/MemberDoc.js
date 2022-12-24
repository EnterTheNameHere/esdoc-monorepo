import AbstractDoc from './AbstractDoc.js';
import MethodDoc from './MethodDoc.js';
import babelGenerator from '@babel/generator';

console.log('>>>> __filename', __filename);

/**
 * Doc Class from Member Expression AST node.
 */
export default class MemberDoc extends AbstractDoc {
  /**
   * apply own tag.
   * @private
   */
  _apply() {
    super._apply();

    Reflect.deleteProperty(this._value, 'export');
    Reflect.deleteProperty(this._value, 'importPath');
    Reflect.deleteProperty(this._value, 'importStyle');
  }

  /** specify ``member`` to kind. */
  _$kind() {
    super._$kind();
    
    this._value.kind = 'member';
  }

  /** use static property in class */
  _$static() {
    super._$static();

    let parent = this._node.parent;
    while (parent) {
      if (parent.type === 'ClassMethod') {
        this._value.static = parent.static;
        break;
      }
      parent = parent.parent;
    }
  }

  /** take out self name from self node */
  _$name() {
    super._$name();
    
    if (this._node.left.computed) {
      const expression = babelGenerator(this._node.left.property).code.replace(/^this/u, '');
      this._value.name = `[${expression}]`;
    } else if ( this._node.type === 'ClassPrivateProperty' ) {
      this._value.name = this._node.key.id.name;
    } else {
      this._value.name = this._flattenMemberExpression(this._node.left).replace(/^this\./u, '');
    }
  }

  /** borrow {@link MethodDoc#@_memberof} */
  _$memberof() {
    super._$memberof();

    Reflect.apply(MethodDoc.prototype._$memberof, this, []);
  }
}
