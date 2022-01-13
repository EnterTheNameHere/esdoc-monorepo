import ESDocCLI from '../../out/ESDocCLI';
import process from 'process';
import fs from 'fs-extra';
import assert from 'assert';
import path from 'path';
import { fork } from 'child_process';

function helperRunScript( filePath, args, responseCallback ) {
    let responseSent = false;
    if( typeof args === "string" ) args = [args];
    const childProcess = fork( filePath, args, { stdio: 'pipe' } );

    const stdoutOutput = [];
    childProcess.stdout.on( 'data', (output) => {
        stdoutOutput.push( output.toString('utf-8') );
    });

    childProcess.on('error', function (err) {
        if( responseSent ) return;
        responseSent = true;
        responseCallback( { error: err, code: err.code, stdoutOutput: stdoutOutput } );
    });

    childProcess.on('exit', function (code) {
        if( responseSent ) return;
        responseSent = true;
        responseCallback( { error: null, code: code, stdoutOutput: stdoutOutput } );
    });
}

describe('test ESDocCLI:', function () {
    describe('display version', function () {
        it('shows version on -v parameter', function (done) {
            helperRunScript('./out/ESDocCLI.js', '-v', function ( response ) {
                assert.equal( response.code, 0 );
                assert.equal( response.error, null );
                const versionOutput = [];
                const origLog = console.log;
                const mockedLog = (output) => { versionOutput.push(`${output}\n`); };
                console.log = mockedLog;
                new ESDocCLI([null, null])._showVersion();
                console.log = origLog;
                assert.notStrictEqual( versionOutput.length, 0 );
                assert.deepEqual( response.stdoutOutput, versionOutput );
                done();
            });
        });

        it('shows version on --version parameter', function (done) {
            helperRunScript('./out/ESDocCLI.js', '--version', function ( response ) {
                assert.equal( response.code, 0 );
                assert.equal( response.error, null );
                const versionOutput = [];
                const origLog = console.log;
                const mockedLog = (output) => { versionOutput.push(`${output}\n`); };
                console.log = mockedLog;
                new ESDocCLI([null, null])._showVersion();
                console.log = origLog;
                assert.notStrictEqual( versionOutput.length, 0 );
                assert.deepEqual( response.stdoutOutput, versionOutput );
                done();
            });
        });
    });

    describe('display help', function () {
        it('shows help on -h parameter', function (done) {
            helperRunScript('./out/ESDocCLI.js', '-h', function ( response ) {
                assert.equal( response.code, 0 );
                assert.equal( response.error, null );
                const helpOutput = [];
                const origLog = console.log;
                const mockedLog = (...output) => { helpOutput.push(`${output}\n`); };
                console.log = mockedLog;
                new ESDocCLI([null, null])._showHelp();
                console.log = origLog;
                assert.notStrictEqual( helpOutput.length, 0 );
                assert.deepEqual( response.stdoutOutput, helpOutput );
                done();
            });
        });

        it('shows help on --help parameter', function (done) {
            helperRunScript('./out/ESDocCLI.js', '--help', function ( response ) {
                assert.equal( response.code, 0 );
                assert.equal( response.error, null );
                const helpOutput = [];
                const origLog = console.log;
                const mockedLog = (...output) => { helpOutput.push(`${output}\n`); };
                console.log = mockedLog;
                new ESDocCLI([null, null])._showHelp();
                console.log = origLog;
                assert.notStrictEqual( helpOutput.length, 0 );
                assert.deepEqual( response.stdoutOutput, helpOutput );
                done();
            });
        });

        it('shows help if no config is found', function (done) {
            process.chdir('./test/');
            helperRunScript('../out/ESDocCLI.js', '', function ( response ) {
                assert.equal( response.code, 1 );
                assert.equal( response.error, null );
                const versionOutput = [];
                const origLog = console.log;
                const mockedLog = (...output) => { versionOutput.push(`${output}\n`); };
                console.log = mockedLog;
                new ESDocCLI([null, null])._showHelp();
                console.log = origLog;
                assert.notStrictEqual( versionOutput.length, 0 );
                assert.deepEqual( response.stdoutOutput, versionOutput );
                done();
            });
            process.chdir('../');
        });
    });

    describe('command option', function () {
        const orig = console.log;
        it('can show help', function () {
            const argv = [null, null];
            const cli = new ESDocCLI(argv);
            console.log = function(){};
            cli._showHelp();
            console.log = orig;
        });
        
        it('can show version', function () {
            const argv = [null, null];
            const cli = new ESDocCLI(argv);
            console.log = function(){};
            cli._showVersion();
            console.log = orig;
        });
    });
    
    describe('find configuration', function () {
        describe('-c parameter', function () {
            it('finds file', function () {
                process.chdir('./test/');
                fs.writeFileSync('customFile.json', 'dummy');
                const cli = new ESDocCLI([null, null, '-c', 'customFile.json']);
                assert.equal(cli._findConfigFilePath(), 'customFile.json');
                fs.unlinkSync('customFile.json');
                process.chdir('../');
            });
    
            it('does not find wrong file', function () {
                process.chdir('./test/');
                const cli = new ESDocCLI([null, null, '-c', 'thisFileDoesNotExist.json']);
                assert.equal(cli._findConfigFilePath(), null);
                process.chdir('../');
            });
    
            it('still does not find wrong file, but finds implicit file', function () {
                process.chdir('./test/');
                fs.writeFileSync('.esdoc.json', 'dummy');
                const cli = new ESDocCLI([null, null, '-c', 'thisFileDoesNotExist.json']);
                assert.equal(cli._findConfigFilePath(), path.resolve('.esdoc.json'));
                fs.unlinkSync('.esdoc.json');
                process.chdir('../');
            });
        });

        describe('--config parameter', function () {
            it('finds file', function () {
                process.chdir('./test/');
                fs.writeFileSync('customFile.json', 'dummy');
                const cli = new ESDocCLI([null, null, '--config', 'customFile.json']);
                assert.equal(cli._findConfigFilePath(), 'customFile.json');
                fs.unlinkSync('customFile.json');
                process.chdir('../');
            });
    
            it('does not find wrong file', function () {
                process.chdir('./test/');
                const cli = new ESDocCLI([null, null, '--config', 'thisFileDoesNotExist.json']);
                assert.equal(cli._findConfigFilePath(), null);
                process.chdir('../');
            });
    
            it('still does not find wrong file, but finds implicit file', function () {
                process.chdir('./test/');
                fs.writeFileSync('.esdoc.json', 'dummy');
                const cli = new ESDocCLI([null, null, '--config', 'thisFileDoesNotExist.json']);
                assert.equal(cli._findConfigFilePath(), path.resolve('.esdoc.json'));
                fs.unlinkSync('.esdoc.json');
                process.chdir('../');
            });
        });

        describe('implicit file names', function () {
            it('finds .esdoc.json', function () {
                process.chdir('./test/');
                fs.writeFileSync('.esdoc.json', 'dummy');
                const cli = new ESDocCLI([null, null]);
                assert.equal(cli._findConfigFilePath(), path.resolve('.esdoc.json'));
                fs.unlinkSync('.esdoc.json');
                process.chdir('../');
            });
    
            it('finds esdoc.json', function () {
                process.chdir('./test/');
                fs.writeFileSync('esdoc.json', 'dummy');
                const cli = new ESDocCLI([null, null]);
                assert.equal(cli._findConfigFilePath(), path.resolve('esdoc.json'));
                fs.unlinkSync('esdoc.json');
                process.chdir('../');
            });

            it('finds .esdoc.js', function () {
                process.chdir('./test/');
                fs.writeFileSync('.esdoc.js', 'dummy');
                const cli = new ESDocCLI([null, null]);
                assert.equal(cli._findConfigFilePath(), path.resolve('.esdoc.js'));
                fs.unlinkSync('.esdoc.js');
                process.chdir('../');
            });
            
            it('finds esdoc.js', function () {
                process.chdir('./test/');
                fs.writeFileSync('esdoc.js', 'dummy');
                const cli = new ESDocCLI([null, null]);
                assert.equal(cli._findConfigFilePath(), path.resolve('esdoc.js'));
                fs.unlinkSync('esdoc.js');
                process.chdir('../');
            });
        });

        it('searches for config file in correct order', function () {
            process.chdir('./test/');
            fs.writeFileSync('custom.js', 'dummy');
            fs.writeFileSync('.esdoc.json', 'dummy');
            fs.writeFileSync('esdoc.json', 'dummy');
            fs.writeFileSync('.esdoc.js', 'dummy');
            fs.writeFileSync('esdoc.js', 'dummy');
            const cli = new ESDocCLI([null, null, '-c', 'custom.js']);
            assert.equal(cli._findConfigFilePath(), 'custom.js');
            fs.unlinkSync('custom.js');
            assert.equal(cli._findConfigFilePath(), path.resolve('.esdoc.json'));
            fs.unlinkSync('.esdoc.json');
            assert.equal(cli._findConfigFilePath(), path.resolve('esdoc.json'));
            fs.unlinkSync('esdoc.json');
            assert.equal(cli._findConfigFilePath(), path.resolve('.esdoc.js'));
            fs.unlinkSync('.esdoc.js');
            assert.equal(cli._findConfigFilePath(), path.resolve('esdoc.js'));
            fs.unlinkSync('esdoc.js');
            process.chdir('../');
        });
    });
});
