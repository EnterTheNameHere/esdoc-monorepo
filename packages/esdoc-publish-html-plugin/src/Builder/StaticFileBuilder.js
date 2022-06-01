import path from 'path';
import DocBuilder from './DocBuilder.js';

/**
 * Static file output builder class.
 */
export default class StaticFileBuilder extends DocBuilder {
  exec(writeFile, copyDir) {
    // If HTML template config.json specifies static directories, copy these into final documentation.
    // eg. staticDirectories = ['css', 'images'] => copy the 'css' directory, copy 'images' and on...
    if(Object.prototype.hasOwnProperty.call(this.Plugin.TemplateConfig,'staticDirectories')) {
      let staticDirectories = this.Plugin.TemplateConfig.staticDirectories;
      // Make single string to array...
      if(typeof staticDirectories === 'string') staticDirectories = [staticDirectories];
      if(!Array.isArray(staticDirectories)) {
        const errorText = `Error: HTML template's config.json property 'staticDirectories' is expected to be an Array of strings!`;
        console.error(errorText);
        throw new TypeError(errorText);
      }
      
      for( const directoryName of this.Plugin.TemplateConfig.staticDirectories ) {
        if(this.Plugin.Verbose) console.info('Copying ', directoryName);
        copyDir(path.resolve(this.Plugin.TemplateDirectory, directoryName), directoryName);
      }
    }
  }
}
