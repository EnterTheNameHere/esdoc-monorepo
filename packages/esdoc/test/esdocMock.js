import fse from 'fs-extra';
import upath from 'upath';
import { fork } from 'child_process';

/**
 * We don't care about security here, just generate random 16 char string...
 * @warning Unsecure!
 * @returns {string} 16 char string
 */
function generateRandomID() {
    const source = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
    let str = '';
    
    for( let num = 0; num < 17; num += 1 ) {
        const index = Math.floor( Math.random() * 16 );
        str += source[index];
    }
    
    return str;
}

export class MockESDocTestEnvironment {
    /**
     * Directory under which will be mock environment (new directory named as ID) created.
     * @type {string}
     */
    static BaseMockingDirectoryPath = upath.resolve(require('node:os').tmpdir(), 'esdoc-tests');
    
    static MockNodeModulesPath = 'node_modules/';
    
    static MockNodeModulesESDocPackagePath = '@enterthenamehere/esdoc/';
    
    /**
     * Returns ESDoc instance.
     * @type {ESDoc}
     */
    get ESDoc() {
        return this._ESDoc;
    }
    
    /**
     * Returns ESDocCLI instance.
     * @type {ESDocCLI}
     */
    get ESDocCLI() {
        return this._ESDocCLI;
    }
    
    /**
     * Creates new mock ESDoc and ESDocCLI to be used for testing. Remember to call {@this#clean} when you are done testing to clean up.
     * @warning ESDoc and ESDoc CLI are copied into this environment under out/ directory.
     *          No check is done against you overwriting these files.
     */
    constructor() {
        /**
         * @type {string} A root directory in which new directory with {@this._id} 
         *                name will be created and environment prepared for testing 
         *                in it. Each instance remembers it's own just in case
         *                the static one {@this.BaseMockingDirectoryPath} changes 
         *                during the environment's life...
         */
        this._baseMockingDirectoryPath = upath.resolve( MockESDocTestEnvironment.BaseMockingDirectoryPath );
        //console.log('_baseMockingDirectoryPath', this._baseMockingDirectoryPath);

        do {
            /**
             * @type {string} Hexadecimal ID for this mock environment - a directory name
             */
            this._id = generateRandomID();
            //console.log('_id', this._id);
            
            /**
            * @type {string} Directory of this mock environment. Should be CWD when running tests.
            */
            this._directoryPath = upath.join(this._baseMockingDirectoryPath, this._id);
            //console.log('_directoryPath', this._directoryPath);

            // We don't want to use existing directory, so if it already exists, generate new ID.
        } while( fse.pathExistsSync( this._directoryPath ) );
        
        this._mockedNodeModulesPath = upath.join(
            this._directoryPath,
            MockESDocTestEnvironment.MockNodeModulesPath
        );
        //console.log('_mockedNodeModulesPath', this._mockedNodeModulesPath);

        this._mockedESDocPackagePath = upath.join(
            this._mockedNodeModulesPath,
            MockESDocTestEnvironment.MockNodeModulesESDocPackagePath
        );
        //console.log('_mockedESDocPackagePath', this._mockedESDocPackagePath);
        
        /**
         * @type {string} Where ESDoc and ESDocCLI for this mock environment are.
         */
        this._outPath = upath.join(this._mockedESDocPackagePath, 'out/');
        //console.log('_outPath', this._outPath);
        
        /**
         * @type {string} Path to this mock environment's ESDoc.js file.
         */
        this._ESDocPath = upath.join(this._outPath, 'ESDoc.js');
        //console.log('_ESDocPath', this._ESDocPath);
        
        /**
         * @type {string} Path to this mock environment's ESDocCLI.js file.
         */
        this._ESDocCLIPath = upath.join(this._outPath, 'ESDocCLI.js');
        //console.log('_ESDocCLIPath', this._ESDocCLIPath);
        
        const realESDocPackageJSON = upath.resolve(__dirname, '../package.json');
        //console.log('realESDocPackageJSON', realESDocPackageJSON);
        
        fse.ensureDirSync(this._outPath);
        fse.copySync(upath.resolve(__dirname, '../out'), this._outPath);
        fse.copySync(realESDocPackageJSON, upath.join( this._mockedESDocPackagePath, 'package.json' ) );
        
        const copyDependency = (packageName, relativePath) => {
          console.log(`MockESDocTestEnvironment, copying ${packageName} to dependencies.`);
          // Dependencies are placed in esdoc-tests/node_modules, so they
          // can be found from esdoc-tests/<random_id>
          const parts = packageName.split('/');
          const nodeModulesPath = upath.resolve(this._baseMockingDirectoryPath, 'node_modules');
          fse.ensureDirSync(nodeModulesPath);
          const destinationPath = upath.resolve(nodeModulesPath, parts[0]);
          const sourcePath = upath.resolve(require.resolve(packageName), relativePath);
          if(!fse.existsSync(destinationPath)) {
            console.log(`Copying from '${sourcePath}' to '${destinationPath}'.`);
            fse.copySync(sourcePath, destinationPath);
          } else {
            console.log(`'${sourcePath}' already exists.`);
          }
        };
        
        // HACK: Copy dependencies
        copyDependency('fs-extra', '../..');
        copyDependency('universalify', '..');
        copyDependency('graceful-fs', '..');
        copyDependency('jsonfile', '..');
        copyDependency('@babel/traverse', '../../..');
        copyDependency('to-fast-properties', '..');
        copyDependency('debug', '../..');
        copyDependency('ms', '..');
        copyDependency('globals', '..');
        copyDependency('@jridgewell/gen-mapping', '../../..');
        copyDependency('jsesc', '..');
        copyDependency('js-tokens', '..');
        copyDependency('chalk', '..');
        copyDependency('escape-string-regexp', '..');
        copyDependency('ansi-styles', '..');
        copyDependency('supports-color', '..');
        copyDependency('color-convert', '..');
        copyDependency('color-name', '..');
        copyDependency('has-flag', '..');
        copyDependency('upath', '../../..');
        copyDependency('rrdir', '..');
        copyDependency('picomatch', '..');
        copyDependency('lodash', '..');
        copyDependency('minimist', '..');
        
        this._ESDoc = require( upath.resolve( this._ESDocPath ) ).default;
        this._ESDocCLI = require( upath.resolve( this._ESDocCLIPath ) ).default;
        
        // We need to delete the cached version from require, or next time we would get cached version with
        // all data already set instead of freshly initialized
        delete require.cache[require.resolve( upath.resolve(this._ESDocPath) )];
        delete require.cache[require.resolve( upath.resolve(this._ESDocCLIPath) )];
    }
    
    /**
     * Writes `data` to file named `name` under ESDoc environment mock directory.
     * `name` can contain directories, but @warning no check against misuse is done at all!
     * 
     * @param {string} name - Relative path of file, can contain directories.
     * @param {string} data - Will be converted to string by toString().
     */
    writeToFile( name, data ) {
        const path = upath.join(this._directoryPath, name);
        fse.ensureFileSync( path );
        fse.writeFileSync( path, data.toString(), { flag: 'w' } );
    }
    
    /**
     * Writes `jsonData` as JSON to file named `name` under ESDoc environment mock directory.
     * `name` can contain directories, but @warning no check against misuse is done at all!
     * 
     * @param {string} name - Relative path of file, can contain directories.
     * @param {string} jsonData - Will be converted to JSON.
     */
    writeToJSONFile( name, jsonData ) {
        const path = upath.join(this._directoryPath, name);
        fse.ensureFileSync( path );
        fse.outputJsonSync( path, jsonData, { flag: 'w' } );
    }
    
    /**
     * Runs ESDoc CLI, like you would with `npx esdoc` or `esdoc` in npm scripts.
     * @param {any} [args] - Arguments to pass to ESDoc CLI
     * @returns {Promise} See {@link helperRunScriptAsync}
     */
    async run( args ) {
        return helperRunScriptAsync( this._ESDocCLIPath, args, this._directoryPath );
    }
    
    /**
     * Cleans the Mock ESDoc environment. Need to be called manually!
     */
    clean = () => {
        fse.removeSync(this._directoryPath);
    };
}

/**
 * Runs NodeJS file (application) on `filePath`, with `args` passed as arguments to the application.
 * You can optionally set working directory as `cwd`. Received stdout and stderr are returned upon Promise completion.
 * 
 * @param {string} filePath - Application to run on NodeJS.
 * @param {any} [args] - Arguments to pass to the Application.
 * @param {string} [cwd] - Working directory for the Application.
 * @returns {Promise<{ error: Error|null, code: number, std: { out: string[], err: string[] }>}}
 */
 export async function helperRunScriptAsync( filePath, args, cwd ) {
    return new Promise( (resolve, reject) => {
        if( !Array.isArray( args ) ) args = [args];
        
        const options = {
            stdio: 'pipe',
            timeout: 4000, // milliseconds
        };
        
        if( typeof cwd === 'string' ) options.cwd = cwd;
        
        const stdoutOutput = [], stderrOutput = [];
        const childProcess = fork( filePath, args, options );
        
        childProcess.stdout.on( 'data', (output) => {
            stdoutOutput.push( output.toString('utf-8') );
        });
        childProcess.stderr.on( 'data', (output) => {
            stderrOutput.push( output.toString('utf-8') );
        });
        
        childProcess.on( 'error', (error) => {
            // Error is returned as error property. The rest needs to be returned too.
            // eslint-disable-next-line prefer-promise-reject-errors
            reject( { error: error, code: error.code, std: { out: stdoutOutput, err: stderrOutput } } );
        });
        
        childProcess.on( 'close', (code) => {
            resolve( { error: null, code: code, std: { out: stdoutOutput, err: stderrOutput } } );
        });
    });
}
