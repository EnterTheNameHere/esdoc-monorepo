import upath from 'upath';
import fse from 'fs-extra';

class Helper {
  /**
   * Returns path of ESDoc fixture we're currently testing.
   * This variable is set ahead of executing tests by config file used when
   * running mocha test suite through process.env variable.
   * @returns {import('fs-extra').PathLike}
   */
  get fixturePath() {
    if(!process.env.esdoc_fixture_path) throw new Error('esdoc_fixture_path does not exist! This variable is expected '
    + 'to be passed to process.env in mocha config file. It should be set to directory of test fixture we are using.')
    return process.env.esdoc_fixture_path;
  }

  /**
   * Joins given `...args` and normalizes it.
   * @param  {...import('fs-extra').PathLike} args
   * @returns {string}
   */
  joinDir(...args) {
    return upath.normalize(upath.join(...args));
  }
  
  /**
   * Checks if path given as `...args` exists and returns **true** if path exists or **false** if it does not.
   * @param  {...import('fs-extra').PathLike} args
   * @returns {boolean}
   */
  dirExists(...args) {
    return fse.pathExistsSync(this.joinDir(...args));
  }
  
  /**
   * Reads contents of file which path and name are passed as `...args`. It will normalize the given path.
   * @param  {...import('fs-extra').PathLike} args
   * @returns {JSON}
   */
  loadJSONFile(...args) {
    return fse.readJsonSync(this.joinDir(...args));
  }

  /**
   * Returns __filename and __dirname for ES modules. Expects import.meta
   * as an argument.
   * 
   * @example
   * ```js
   * import {__moduleInfo} from 'helper.mjs';
   * 
   * const moduleInfo = __moduleInfo(import.meta);
   * 
   * console.log(moduleInfo.__filename); // "c:/directory/path/filename.extension"
   * console.log(moduleInfo.__dirname);  // "c:/directory/path"
   * ```
   * 
   * ES modules do not have __filename and __dirname defined, but you can
   * use import.meta.url if it's available. This function converts url
   * to filename and dirname.
   * 
   * @param {"import.meta object"} importMeta 
   * @returns {{__filename: string, __dirname: string}}
   */
  __moduleInfo(importMeta) {
    if( importMeta?.url ) {
      const fileName = url.fileURLToPath(importMeta.url);
      return {
        __filename: upath.normalize(fileName),
        __dirname: upath.normalize(upath.dirname(fileName)),
      }
    }

    return {
      __filename: '',
      __dirname: '',
    }
  }
}

const helper = new Helper();
export { helper };
