import fs from 'fs-extra';
import path_package from 'path';

export class MockESDocTestEnvironment {
    /**
     * Returns ESDoc instance.
     */
    get ESDoc() {
        return this._ESDoc;
    }
    
    /**
     * Returns ESDocCLI instance.
     */
    get ESDocCLI() {
        return this._ESDocCLI;
    }

    /**
     * Creates new mock ESDoc and ESDocCLI to be used for testing. Remember to call @this#clean when you are done testing to clean up.
     * @param {string} name Name of "environment", it is basically name of directory which will be created and tests run in.
     * @param {string} [directoryPath] Optional base directory, defaults to a 'test' directory
     */
    constructor( name, directoryPath = './test/tmp_dir/' ) {
        this._name = name;
        this._mockRootPath = directoryPath;
        this._outPath = path_package.join(directoryPath, name, 'out/');
        this._fullDirectoryPath = path_package.join(directoryPath, name);
        this._ESDocPath = path_package.join(this._outPath, 'ESDoc.js');
        this._ESDocCLIPath = path_package.join(this._outPath, 'ESDocCLI.js');

        fs.ensureDirSync(this._outPath);
        fs.copySync('./out/ESDoc.js', this._ESDocPath );
        fs.copySync('./out/ESDocCLI.js', this._ESDocCLIPath );
        
        console.log( 'cwd', process.cwd() );
        console.log( 'this._ESDocPath', this._ESDocPath );
        console.log( 'resolve', path_package.resolve( this._ESDocPath ) );
        console.log( '__dirname', __dirname );
        this._ESDoc = require( path_package.resolve( this._ESDocPath ) ).default;
        console.log('_ESDoc', this._ESDoc);
        this._ESDocCLI = require( path_package.resolve( this._ESDocCLIPath ) ).default;
        console.log('_ESDoc', this._ESDocCLIPath);
        
        // We need to delete the cached version from require, or next time we would get cached version with
        // all data already set instead of freshly initialized
        delete require.cache[require.resolve( path_package.resolve(this._ESDocPath) )];
        delete require.cache[require.resolve( path_package.resolve(this._ESDocCLIPath) )];
    }
    
    writeToFile( name, data ) {
        fs.writeFileSync( path_package.join(this._fullDirectoryPath, name), data, { flag: 'w' } );
    }
    
    writeToJSONFile( name, jsonData ) {
        fs.outputJsonSync( path_package.join(this._fullDirectoryPath, name), jsonData, { flag: 'w' } );
    }
    
    /**
     * Cleans the Mock ESDoc environment. Need to be called manually!
     */
    clean = () => {
        fs.removeSync(this._mockRootPath);
    };
}
