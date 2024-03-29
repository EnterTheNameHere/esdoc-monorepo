import upath from 'upath';
import os from 'os';

/**
 * file path resolver.
 * @example
 * let pathResolver = new PathResolver('./src', 'foo/bar.js', 'foo-bar', 'foo/bar.js');
 * pathResolver.importPath; // 'foo-bar'
 * pathResolver.filePath; // 'src/foo/bar.js'
 * pathResolver.resolve('./baz.js'); // 'src/foo/baz.js'
 */
export default class PathResolver {
  /**
   * create instance.
   * @param {string} inDirPath - root directory path.
   * @param {string} filePath - relative file path from root directory path.
   * @param {string} [packageName] - npm package name.
   * @param {string} [mainFilePath] - npm main file path.
   */
  constructor(inDirPath, filePath, packageName = null, mainFilePath = null) {
    if( typeof(inDirPath) !== 'string' ) {
        console.error('[31mPathResolver::constructor() - inDirPath must be string[0m');
        throw new Error('PathResolver::constructor() - inDirPath must be string');
    }
    if( typeof(filePath) !== 'string' ) {
        console.error('[31mPathResolver::constructor() - filePath must be string[0m');
        throw new Error('PathResolver::constructor() - filePath must be string');
    }

    /** @type {string} */
    this._inDirPath = upath.resolve(inDirPath);

    /** @type {string} */
    this._filePath = upath.resolve(filePath);

    /** @type {NPMPackageObject} */
    this._packageName = packageName;

    if (mainFilePath) {
      /** @type {string} */
      this._mainFilePath = upath.resolve(mainFilePath);
    }
  }

  /**
   * import path that is considered package name, main file and path prefix.
   * @type {string}
   */
  get importPath() {
    const relativeFilePath = this.filePath;

    if (this._mainFilePath === upath.resolve(relativeFilePath)) {
      return this._packageName;
    }

    let filePath = '';
    if (this._packageName) {
      filePath = upath.normalize(`${this._packageName}${upath.sep}${relativeFilePath}`);
    } else {
      filePath = `./${relativeFilePath}`;
    }

    return this._slash(filePath);
  }

  /**
   * file full path.
   * @type {string}
   */
  get fileFullPath() {
    return this._slash(this._filePath);
  }

  /**
   * file path that is relative path on root dir.
   * @type {string}
   */
  get filePath() {
    const relativeFilePath = upath.relative(upath.dirname(this._inDirPath), this._filePath);
    return this._slash(relativeFilePath);
  }

  /**
   * resolve file path on this file.
   * @param {string} relativePath - relative path on this file.
   */
  resolve(relativePath) {
    const selfDirPath = upath.dirname(this._filePath);
    const resolvedPath = upath.resolve(selfDirPath, relativePath);
    const resolvedRelativePath = upath.relative(upath.dirname(this._inDirPath), resolvedPath);
    return this._slash(resolvedRelativePath);
  }

  /**
   * convert 'back slash' to 'slash'.
   * path separator is 'back slash' if platform is windows.
   * @param {string} filePath - target file path.
   * @returns {string} converted path.
   * @private
   */
  _slash(filePath) {
    if (os.platform() === 'win32') {
      filePath = filePath.replace(/\\/gu, '/');
    }

    return filePath;
  }
}
