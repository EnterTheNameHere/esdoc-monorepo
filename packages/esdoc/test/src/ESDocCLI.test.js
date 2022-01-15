import ESDocCLI from '../../out/ESDocCLI';
import process from 'process';
import fs from 'fs-extra';
import assert from 'assert';
import path from 'path';

import { helperRunScriptAsync } from '../../../../test/esdocMock';

describe('test ESDocCLI:', function () {
    describe('display version', function () {
        it('shows version on -v parameter', async function () {
            // First call it programmatically
            const versionOutput = [];
            const origLog = console.log;
            const mockedLog = (output) => { versionOutput.push(`${output}\n`); };
            console.log = mockedLog;
            new ESDocCLI([null, null])._showVersion();
            console.log = origLog;
            
            // Then run it as CLI
            const response = await helperRunScriptAsync('./out/ESDocCLI.js', '-v');
            assert.equal( response.code, 0 );
            assert.equal( response.error, null );
            
            // Compare results
            assert.notStrictEqual( versionOutput.length, 0 );
            assert.deepEqual( response.std.out, versionOutput );
        });

        it('shows version on --version parameter', async function () {
            // First call it programmatically
            const versionOutput = [];
            const origLog = console.log;
            const mockedLog = (output) => { versionOutput.push(`${output}\n`); };
            console.log = mockedLog;
            new ESDocCLI([null, null])._showVersion();
            console.log = origLog;
            
            // Then run it as CLI
            const response = await helperRunScriptAsync('./out/ESDocCLI.js', '--version');
            assert.equal( response.code, 0 );
            assert.equal( response.error, null );
            
            // Compare results
            assert.notStrictEqual( versionOutput.length, 0 );
            assert.deepEqual( response.std.out, versionOutput );
        });
    });

    describe('display help', function () {
        it('shows help on -h parameter', async function () {
            // First call it programmatically
            const helpOutput = [];
            const origLog = console.log;
            const mockedLog = (...output) => { helpOutput.push(`${output}\n`); };
            console.log = mockedLog;
            new ESDocCLI([null, null])._showHelp();
            console.log = origLog;

            // Then run it as CLI
            const response = await helperRunScriptAsync('./out/ESDocCLI.js', '-h');
            assert.equal( response.code, 0 );
            assert.equal( response.error, null );
            
            // Compare results
            assert.notStrictEqual( helpOutput.length, 0 );
            assert.deepEqual( response.std.out, helpOutput );
        });

        it('shows help on --help parameter', async function () {
            // First call it programmatically
            const helpOutput = [];
            const origLog = console.log;
            const mockedLog = (...output) => { helpOutput.push(`${output}\n`); };
            console.log = mockedLog;
            new ESDocCLI([null, null])._showHelp();
            console.log = origLog;

            // Then run it as CLI
            const response = await helperRunScriptAsync('./out/ESDocCLI.js', '--help');
            assert.equal( response.code, 0 );
            assert.equal( response.error, null );
            
            // Compare results
            assert.notStrictEqual( helpOutput.length, 0 );
            assert.deepEqual( response.std.out, helpOutput );
        });

        it('shows help if no config is found', async function () {
            // First call it programmatically
            const versionOutput = [];
            const origLog = console.log;
            const mockedLog = (...output) => { versionOutput.push(`${output}\n`); };
            console.log = mockedLog;
            new ESDocCLI([null, null])._showHelp();
            console.log = origLog;

            // Then run it as CLI
            process.chdir('./test/');
            const response = await helperRunScriptAsync('../out/ESDocCLI.js', '');
            process.chdir('../');
            assert.equal( response.code, 1 );
            assert.equal( response.error, null );
            
            // Compare results
            assert.notStrictEqual( versionOutput.length, 0 );
            assert.deepEqual( response.std.out, versionOutput );
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
