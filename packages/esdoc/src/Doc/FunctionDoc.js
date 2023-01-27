import babelGenerator from '@babel/generator';
import AbstractDoc from './AbstractDoc.js';
import NamingUtil from '../Util/NamingUtil';

console.log('>>>> __filename', __filename);

/**
 * Doc Class from Function declaration AST node.
 */
export default class FunctionDoc extends AbstractDoc {
  /** specify ``function`` to kind. */
  _$kind() {
    super._$kind();
    this._value.kind = 'function';
  }

  /** take out self name from self node */
  _$name() {
    super._$name();

    if (this._node.id) {
      if (this._node.id.type === 'MemberExpression') {
        // e.g. foo[bar.baz] = function bal(){}
        const expression = babelGenerator(this._node.id).code;
        this._value.name = `[${expression}]`;
      } else {
        this._value.name = this._node.id.name;
      }
    } else if (!this._node.id && this._node.parent && this._node.parent.type === 'ExportDefaultDeclaration') {
      this._value.name = NamingUtil.filePathToName( this._pathResolver.filePath );
      this._value.anonymous = true;
    } else {
      this._value.name = NamingUtil.filePathToName( this._pathResolver.filePath );
    }
  }

  /** take out self name from file path */
  _$memberof() {
    super._$memberof();
    this._value.memberof = this._pathResolver.filePath;
  }

  /** check generator property in self node */
  _$generator() {
    super._$generator();
    this._value.generator = this._node.generator;
  }

  /**
   * use async property of self node.
   */
  _$async() {
    super._$async();
    this._value.async = this._node.async;
  }
}
