const process = require('process');
const fs = require('fs-extra');
const readdirp = require('readdirp');
const path = require('path');

const expect = require('chai').expect;

const FileManager = require('../../lib/Util/FileManager').default;

let originalPath = '';

describe('test/Utils/FileManager', function () {
    originalPath = process.cwd();
    before('Create testing directory/file tree', function () {
        process.chdir(originalPath);
        process.chdir('./test');
        // Weird formatting to visualize where in tree we are atm.
        {
            fs.ensureDirSync('tree');
            process.chdir('tree');
            {
                fs.ensureDirSync('plugins');
                process.chdir('./plugins');
                fs.ensureFileSync('standard.js');
                fs.ensureFileSync('lint.js');
                fs.ensureFileSync('typescript.ts');
                fs.ensureFileSync('publish-html.html');
                process.chdir('..');
            }
            {
                fs.ensureDirSync('earth');
                process.chdir('./earth');
                {
                    fs.ensureDirSync('europe');
                    process.chdir('./europe');
                    {
                        fs.ensureDirSync('germany');
                        process.chdir('./germany');
                        fs.ensureFileSync('berlin.js');
                        fs.ensureFileSync('dortmund.ts');
                        fs.ensureFileSync('dresden.test.js');
                        process.chdir('..');
                    }
                    {
                        fs.ensureDirSync('czech republic');
                        process.chdir('czech republic');
                        fs.ensureFileSync('prague.html');
                        fs.ensureFileSync('brno.js');
                        fs.ensureFileSync('pilsen.test.ts');
                        process.chdir('..');
                    }
                    {
                        fs.ensureDirSync('slovakia');
                        process.chdir('slovakia');
                        fs.ensureFileSync('bratislava.html');
                        process.chdir('..');
                    }
                    process.chdir('..')
                }
                {
                    fs.ensureDirSync('asia');
                    process.chdir('asia');
                    fs.ensureFileSync('india.js');
                    fs.ensureFileSync('japan.html');
                    fs.ensureFileSync('taiwan.test.js');
                    process.chdir('..');
                }
                {
                    fs.ensureDirSync('australia');
                    process.chdir('australia');
                    fs.ensureFileSync('oceania.config.js');
                    process.chdir('..');
                }
                {
                    fs.ensureDirSync('zealandia');
                    process.chdir('zealandia');
                    fs.ensureFileSync('middle earth.config.ts');
                    process.chdir('..');
                }
                {
                    fs.ensureDirSync('north america');
                    process.chdir('north america');
                    {
                        fs.ensureDirSync('node_modules');
                        process.chdir('node_modules');
                        fs.ensureFileSync('node');
                        process.chdir('..');
                    }
                    process.chdir('..');
                }
                {
                    fs.ensureDirSync('south america');
                    process.chdir('south america');
                    {
                        fs.ensureDirSync('test');
                        process.chdir('test');
                        fs.ensureFileSync('test.test.ts');
                        process.chdir('..');
                    }
                    process.chdir('..');
                }
                {
                    fs.ensureDirSync('africa');
                    process.chdir('africa');
                    {
                        fs.ensureDirSync('spec');
                        process.chdir('spec');
                        fs.ensureFileSync('spec.spec.js');
                        process.chdir('..');
                    }
                    process.chdir('..');
                }
                {
                    fs.ensureDirSync('antarctica');
                    process.chdir('antarctica');
                    {
                        // Is empty
                    }
                    process.chdir('..');
                }
                process.chdir('..');
            }
            process.chdir('..');
        }
        process.chdir('..');
    });

    after("Clean testing directory/file tree", function () {
        process.chdir(originalPath);
        process.chdir('./test');
        fs.rmdirSync( 'tree', { recursive: true, force: true } );
        process.chdir('..');
    });

    it("Returns all files inside directory recursive", function () {
        process.chdir(originalPath);
        process.chdir('./test');
        const currentPath = path.win32.normalize(process.cwd());

        const expected = [
            path.win32.join( currentPath, 'tree/plugins/lint.js' ),
            path.win32.join( currentPath, 'tree/plugins/publish-html.html' ),
            path.win32.join( currentPath, 'tree/plugins/standard.js' ),
            path.win32.join( currentPath, 'tree/plugins/typescript.ts' ),
            path.win32.join( currentPath, 'tree/earth/zealandia/middle earth.config.ts' ),
            path.win32.join( currentPath, 'tree/earth/south america/test/test.test.ts' ),
            path.win32.join( currentPath, 'tree/earth/north america/node_modules/node' ),
            path.win32.join( currentPath, 'tree/earth/europe/slovakia/bratislava.html' ),
            path.win32.join( currentPath, 'tree/earth/europe/germany/berlin.js' ),
            path.win32.join( currentPath, 'tree/earth/europe/germany/dortmund.ts' ),
            path.win32.join( currentPath, 'tree/earth/europe/germany/dresden.test.js'),
            path.win32.join( currentPath, 'tree/earth/europe/czech republic/brno.js'),
            path.win32.join( currentPath, 'tree/earth/europe/czech republic/pilsen.test.ts'),
            path.win32.join( currentPath, 'tree/earth/europe/czech republic/prague.html'),
            path.win32.join( currentPath, 'tree/earth/australia/oceania.config.js'),
            path.win32.join( currentPath, 'tree/earth/asia/india.js'),
            path.win32.join( currentPath, 'tree/earth/asia/japan.html'),
            path.win32.join( currentPath, 'tree/earth/asia/taiwan.test.js'),
            path.win32.join( currentPath, 'tree/earth/africa/spec/spec.spec.js')
        ];
        
        const actual = FileManager.getListOfFiles('tree');
        expect(actual).eql(expected)
        process.chdir('..');
    });

    it("Returns only html files", function () {
        process.chdir(originalPath);
        process.chdir('./test');
        const currentPath = path.win32.normalize(process.cwd());

        const expected = [
            path.win32.join( currentPath, 'tree/plugins/publish-html.html' ),
            path.win32.join( currentPath, 'tree/earth/europe/slovakia/bratislava.html' ),
            path.win32.join( currentPath, 'tree/earth/europe/czech republic/prague.html'),
            path.win32.join( currentPath, 'tree/earth/asia/japan.html'),
        ];

        const actual = FileManager.getListOfFiles('tree', ['*.html']);
        expect(actual).eql(expected)
        process.chdir('..');
    });

    it("Returns only html and js files", function () {
        process.chdir(originalPath);
        process.chdir('./test');
        const currentPath = path.win32.normalize(process.cwd());

        const expected = [
            path.win32.join( currentPath, 'tree/plugins/lint.js' ),
            path.win32.join( currentPath, 'tree/plugins/publish-html.html' ),
            path.win32.join( currentPath, 'tree/plugins/standard.js' ),
            path.win32.join( currentPath, 'tree/earth/europe/slovakia/bratislava.html' ),
            path.win32.join( currentPath, 'tree/earth/europe/germany/berlin.js' ),
            path.win32.join( currentPath, 'tree/earth/europe/germany/dresden.test.js'),
            path.win32.join( currentPath, 'tree/earth/europe/czech republic/brno.js'),
            path.win32.join( currentPath, 'tree/earth/europe/czech republic/prague.html'),
            path.win32.join( currentPath, 'tree/earth/australia/oceania.config.js'),
            path.win32.join( currentPath, 'tree/earth/asia/india.js'),
            path.win32.join( currentPath, 'tree/earth/asia/japan.html'),
            path.win32.join( currentPath, 'tree/earth/asia/taiwan.test.js'),
            path.win32.join( currentPath, 'tree/earth/africa/spec/spec.spec.js')
        ];

        const actual = FileManager.getListOfFiles('tree', ['*.html', '*.js']);
        expect(actual).eql(expected)
        process.chdir('..');
    });

    it("Returns only html and js files, except *config.js and *test.js and *spec.js", function (done) {
        process.chdir(originalPath);
        process.chdir('./test');
        const currentPath = path.win32.normalize(process.cwd());

        const expected = [
            path.win32.join( currentPath, 'tree/plugins/lint.js' ),
            path.win32.join( currentPath, 'tree/plugins/publish-html.html' ),
            path.win32.join( currentPath, 'tree/plugins/standard.js' ),
            path.win32.join( currentPath, 'tree/earth/europe/slovakia/bratislava.html' ),
            path.win32.join( currentPath, 'tree/earth/europe/germany/berlin.js' ),
            path.win32.join( currentPath, 'tree/earth/europe/czech republic/brno.js'),
            path.win32.join( currentPath, 'tree/earth/europe/czech republic/prague.html'),
            path.win32.join( currentPath, 'tree/earth/asia/india.js'),
            path.win32.join( currentPath, 'tree/earth/asia/japan.html'),
        ];

        const actual = FileManager.getListOfFiles('tree', ['*.(html|js)'], ['*.(spec|config|test).js']);
        expect(actual).eql(expected)
        process.chdir('..');
    });
});
