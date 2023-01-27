import AbstractDoc from './AbstractDoc.js';
import { FileManager } from '../Util/FileManager';

console.log('>>>> __filename', __filename);

/**
 * Doc Class from source file.
 */
export default class FileDoc extends AbstractDoc {
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

  /** specify ``file`` to kind. */
  _$kind() {
    super._$kind();
    this._value.kind = 'file';
  }

  /** take out self name from file path */
  _$name() {
    super._$name();
    this._value.name = this._pathResolver.filePath;
  }

  /** specify name to longname */
  _$longname() {
    this._value.longname = this._pathResolver.fileFullPath;
  }

  /** specify file content to value.content */
  _$content() {
    super._$content();

    const filePath = this._pathResolver.fileFullPath;
    const content = FileManager.readFileContents(filePath);
    this._value.content = content;
  }
}
