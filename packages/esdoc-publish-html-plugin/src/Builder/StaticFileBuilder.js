import path from 'path';
import DocBuilder from './DocBuilder.js';

console.log('__filename', __filename, '__dirname', __dirname);

/**
 * Static file output builder class.
 */
export default class StaticFileBuilder extends DocBuilder {
  exec(writeFile, copyDir) {
    copyDir(path.resolve(this._template, 'css'), './css');
    copyDir(path.resolve(this._template, 'script'), './script');
    copyDir(path.resolve(this._template, 'image'), './image');
  }
}
