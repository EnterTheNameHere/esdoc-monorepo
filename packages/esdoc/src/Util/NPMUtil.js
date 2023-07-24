import upath from 'upath';
import { FileManager } from './FileManager';

/**
 * Node Package Manager(npm) util class.
 */
export default class NPMUtil {
  /**
   * find ESDoc package.json object.
   * @returns {Object} package.json object.
   */
  static findPackage() {
    let packageObj = null;
    try {
      const packageFilePath = upath.resolve(__dirname, '../../package.json');
      const json = FileManager.readFileContents(packageFilePath);
      packageObj = JSON.parse(json);
    } catch (e) {
      const packageFilePath = upath.resolve(__dirname, '../../../package.json');
      const json = FileManager.readFileContents(packageFilePath);
      packageObj = JSON.parse(json);
    }

    return packageObj;
  }
}
