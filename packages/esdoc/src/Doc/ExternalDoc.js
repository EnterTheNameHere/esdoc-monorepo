import AbstractDoc from './AbstractDoc.js';
import ParamParser from '../Parser/ParamParser.js';

const debug = require('debug')('ESDoc:ExternalDoc');

/**
 * Doc Class from virtual comment node of external.
 */
export default class ExternalDoc extends AbstractDoc {
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

  /** specify ``external`` to kind. */
  _$kind() {
    super._$kind();
    this._value.kind = 'external';
  }

  /** take out self name from tag */
  _$name() {
    const value = this._findTagValue(['@external']);
    if (!value) {
      debug('Cannot resolve @external name.');
    }

    this._value.name = value;

    const tags = this._findAll(['@external']);
    if (!tags) {
      debug('Cannot resolve @external name.');
      return;
    }

    let name = '';
    for (const tag of tags) {
      const {typeText, paramDesc} = ParamParser.parseParamValue(tag.tagValue, true, false, true);
      name = typeText;
      this._value.externalLink = paramDesc;
    }

    this._value.name = name;
  }

  /** take out self memberof from file path. */
  _$memberof() {
    super._$memberof();
    this._value.memberof = this._pathResolver.filePath;
  }

  /** specify name to longname */
  _$longname() {
    super._$longname();
    if (this._value.longname) return;
    this._value.longname = this._value.name;
  }

  /** avoid unknown tag */
  _$external() {}
}
