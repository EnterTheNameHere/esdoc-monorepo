import fs from 'fs-extra';
import path_package from 'path';
import rrdir from 'rrdir';

console.log('>>>> __filename', __filename);

class FileDoesNotExistOrNoPermissionError extends Error {
    /**
     * Custom Error with `path` parameter to indicate requested file does not exist.
     * @param {fs.PathLike} path file to load.
     */
    constructor( path ) {
        super( `Error: File '${path}' does not exist or ESDoc doesn't have permission to read!` );
        this.name = 'FileDoesNotExistError';
    }
}

class UnableToWriteToFileError extends Error {
    /**
     * Custom Error with `path` parameter to indicate writing into file was unsuccessful.
     * @param {fs.PathLike} path file to write into.
     */
    constructor( path ) {
        super( `Error: Unable to write into '${path}'!` );
        this.name = 'UnableToWriteToFileError';
    }
}

class PathIsDirectoryError extends Error {
    /**
     * Custom Error with `path` parameter to indicate a directory is received where file is expected instead.
     * @param {fs.PathLike} path directory path.
     */
    constructor( path ) {
        super( `Error: Path '${path}' points to a directory. File is expected!` );
        this.name = 'PathIsDirectoryError';
    }
}

class UnableToCopyError extends Error {
    constructor( srcPath, destPath ) {
        super( `Error: Copying ${srcPath} to ${destPath} caused an error!` );
        this.name = 'UnableToCopyError';
    }
}

class FileManager {
    /**
     * Returns list of files inside the `path`, filtered out by `includes` and/or `excludes`.
     * 
     * If `includes` or `excludes` are something else than array like objects they are ignored.
     * If `path` is not a string or is empty, an empty array is returned.
     * 
     * @param {string} path                        The path where to look for files.
     * @param {Array<string>|undefined} [includes] Array of glob patterns for files to explicitly include (empty by default).
     * @param {Array<string>|undefined} [excludes] Array of glob patterns for files to explicitly exclude (empty by default).
     * @returns {Array<string>} List of files (can be empty).
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
     * @param {fs.PathOrFileDescriptor} path path of file to load contents of.
     * @param {string} [encoding='utf8'] default is utf8. Can be one of {@link https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings}.
     * @returns {string} Contents of file at `path`.
     * 
     * @throws {FileDoesNotExistOrNoPermissionError} when file does not exist or cannot be opened.
     * @throws {PathIsDirectoryError} when path is directory but we expect a file.
     */
    readFileContents( path, encoding = 'utf8' ) {
        if( typeof encoding !== 'string' ) encoding = 'utf8';
        if( encoding.toLowerCase() === 'buffer' ) encoding = 'utf8';

        let stats = null;
        try {
            stats = this.getFileStat(path);
        } catch {
            // Ignore
        }
        if( stats && stats.isDirectory() ) throw new PathIsDirectoryError(path);
        
        try {
            // We don't control path!
            const contents = fs.readFileSync( path, { encoding: encoding, flag: 'r' } );
            return contents;
        } catch {
            throw new FileDoesNotExistOrNoPermissionError(path);
        }
    }

    /**
     * Writes `contents` into `path`. If file already exist, it will be overwritten. If parent directories do not exist, they will be created.
     * @param {string} path file to write to. Will be overwritten if it already exists.
     * @param {string} contents contents to write into file.
     * @param {string} [encoding='utf8'] default is utf8. Can be one of {@link https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings}.
     * @throws {UnableToWriteToFileError} when writing to file fails.
     */
    writeFileContents( path, contents, encoding = 'utf8' ) {
        if( typeof encoding !== 'string' || encoding.toLowerCase() === 'buffer' ) encoding = 'utf8';

        try {
            // We don't control path!
            fs.outputFileSync( path, contents, { encoding: encoding } );
        } catch {
            throw new UnableToWriteToFileError(path);
        }
    }

    /**
     * Returns {fs.Stats} instance for `path` file system entry or throws Error if it does not exist.
     * @param {fs.PathLike} path file system entry to get fs.Stats object of.
     * @returns {fs.Stats}
     * @throws {Error} when file system entry does not exist.
     * @see {@link https://nodejs.org/docs/latest/api/fs.html#fs_class_fs_stats} for fs.Stats class.
     */
    getFileStat( path ) {
        // We do not control path!
        return fs.lstatSync( path );
    }

    /**
     * Copy a file or directory contents. @see {@link https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/copy-sync.md}
     * @param {string} srcPath file or directory to copy.
     * @param {string} destPath where to copy it.
     * @throws {UnableToCopyError} when error happens during copying.
     */
    copy( srcPath, destPath ) {
        try {
            // We don't control srcPath or destPath!
            fs.copySync( srcPath, destPath );
        } catch {
            throw new UnableToCopyError( srcPath, destPath );
        }
    }
}

const FileManagerInstance = new FileManager;
export { FileManagerInstance as FileManager, PathIsDirectoryError, FileDoesNotExistOrNoPermissionError, UnableToWriteToFileError, UnableToCopyError };
