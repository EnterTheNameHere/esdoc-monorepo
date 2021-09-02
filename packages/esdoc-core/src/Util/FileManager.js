import fs from 'fs-extra';
import path_package from 'path';
import rrdir from 'rrdir';

class FileDoesNotExistOrNoPermissionError extends Error {
    /**
     * Custom Error with `path` parameter to indicate requested file does not exist.
     * @param {fs.PathLike} path file to load
     */
    constructor( path ) {
        super( `Error: File '${path}' does not exist or ESDoc doesn't have permission to read!` );
        this.name = 'FileDoesNotExistError';
    }
}

class PathIsDirectoryError extends Error {
    constructor( path ) {
        super( `Error: Path '${path}' points to a directory. File is expected!` );
        this.name = 'PathIsDirectoryError';
    }
}

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

    /**
     * Returns contents of file at `path` or throws Error.
     * 
     * @param {fs.PathLike} path path of file to load contents of.
     * @param {string} [encoding='utf8'] default is utf8. Can be one of {@link https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings}.
     * @returns {string} Contents of file at `path`
     * 
     * @throws {FileDoesNotExistOrNoPermissionError} when file does not exist or cannot be opened.
     * @throws {PathIsDirectoryError} when path is directory but we expect a file.
     */
    loadFileContents( path, encoding = 'utf8' ) {
        if( typeof encoding !== 'string' ) encoding = 'utf8';
        if( encoding.toLowerCase() === 'buffer' ) encoding = 'utf8';

        let stats = null;
        try {
            stats = fs.accessSync(path,fs.constants.R_OK | fs.constants.F_OK);
        } catch {
            throw new FileDoesNotExistOrNoPermissionError(path);
        }

        if( stats && stats.isDirectory() ) throw new PathIsDirectoryError(path);

        // We don't control path!
        return fs.readFileSync( path, { encoding: encoding, flag: 'r' } );
    }
}

const FileManagerInstance = new FileManager;
export { FileManagerInstance as FileManager, PathIsDirectoryError, FileDoesNotExistOrNoPermissionError };
