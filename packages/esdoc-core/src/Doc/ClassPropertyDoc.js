import AbstractDoc from './AbstractDoc.js';
import MethodDoc from './MethodDoc.js';

console.log('__filename', __filename, '__dirname', __dirname);

/**
 * Doc Class from ClassProperty AST node.
 */
export default class ClassPropertyDoc extends AbstractDoc {
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

  /** take out self name from self node */
  _$name() {
    super._$name();
    
    if ( this._node.type === 'ClassPrivateProperty' ) {
      this._value.name = this._node.key.id.name;
    } else {
      this._value.name = this._node.key.name;
    }
  }

  /** borrow {@link MethodDoc#@_memberof} */
  _$memberof() {
    super._$memberof();

    Reflect.apply(MethodDoc.prototype._$memberof, this, []);
  }
}
