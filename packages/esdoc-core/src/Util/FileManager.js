import path_package from 'path';
import rrdir from 'rrdir';

class FileManager {
    /**
     * Returns list of files inside the `path`, filtered out by `includes` and/or `excludes`.
     * 
     * If `includes` or `excludes` are something else than array like objects they are ignored.
     * If `path` is not a string or is empty, an empty array is returned.
     * 
     * @param {string} path                        The path where to look for files
     * @param {Array<string>|undefined} [includes] Array of glob patterns for files to explicitly include (empty by default)
     * @param {Array<string>|undefined} [excludes] Array of glob patterns for files to explicitly exclude (empty by default)
     * @returns {Array<string>} List of files (can be empty)
     */
    getListOfFiles( path, includes, excludes) {
        const files = [];

        if( typeof path !== 'string' || path === '' ) return files;

        const options = { followSymlinks: true };
        if( typeof includes === 'object' && typeof includes.length === 'number' && includes.length > 0 ) options.include = includes;
        if( typeof excludes === 'object' && typeof excludes.length === 'number' && excludes.length > 0 ) options.exclude = excludes;

        const entries = rrdir.sync( path_package.join(path), options );
        entries.forEach( (entry) => {
            if( typeof(entry.directory) === 'boolean' && !entry.directory ) {
                files.push( path_package.join( entry.path ) );
            }
        });

        return files;
    }
}

export default new FileManager();
