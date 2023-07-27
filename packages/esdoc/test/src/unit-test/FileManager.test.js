const process = require('process');
const fs = require('fs-extra');
const readdirp = require('readdirp');
const upath = require('upath');

const expect = require('chai').expect;

const { FileManager } = require('../../../out/Util/FileManager');

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
                    process.chdir('..');
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

    after('Clean testing directory/file tree and return to original path', function () {
        process.chdir(originalPath);
        process.chdir('./test');
        fs.rmSync( 'tree', { recursive: true, force: true } );
        process.chdir('..');
    });

    beforeEach('Move to test directory', function () {
        process.chdir(originalPath);
        process.chdir('./test');
    });

    it('Returns all files inside directory recursive', function () {
        const expected = [
            upath.join('tree/plugins/lint.js'),
            upath.join('tree/plugins/publish-html.html'),
            upath.join('tree/plugins/standard.js'),
            upath.join('tree/plugins/typescript.ts'),
            upath.join('tree/earth/zealandia/middle earth.config.ts'),
            upath.join('tree/earth/south america/test/test.test.ts'),
            upath.join('tree/earth/north america/node_modules/node'),
            upath.join('tree/earth/europe/slovakia/bratislava.html'),
            upath.join('tree/earth/europe/germany/berlin.js'),
            upath.join('tree/earth/europe/germany/dortmund.ts'),
            upath.join('tree/earth/europe/germany/dresden.test.js'),
            upath.join('tree/earth/europe/czech republic/brno.js'),
            upath.join('tree/earth/europe/czech republic/pilsen.test.ts'),
            upath.join('tree/earth/europe/czech republic/prague.html'),
            upath.join('tree/earth/australia/oceania.config.js'),
            upath.join('tree/earth/asia/india.js'),
            upath.join('tree/earth/asia/japan.html'),
            upath.join('tree/earth/asia/taiwan.test.js'),
            upath.join('tree/earth/africa/spec/spec.spec.js')
        ];
        
        const actual = FileManager.getListOfFiles('tree');
        expect(actual).to.have.all.members(expected);
    });

    it('Returns only html files', function () {
        const expected = [
            upath.join('tree/plugins/publish-html.html' ),
            upath.join('tree/earth/europe/slovakia/bratislava.html' ),
            upath.join('tree/earth/europe/czech republic/prague.html'),
            upath.join('tree/earth/asia/japan.html'),
        ];

        const actual = FileManager.getListOfFiles('tree', ['**/*.html']);
        expect(actual).to.have.all.members(expected);
    });

    it('Returns only html and js files', function () {
        const expected = [
            upath.join('tree/plugins/lint.js' ),
            upath.join('tree/plugins/publish-html.html' ),
            upath.join('tree/plugins/standard.js' ),
            upath.join('tree/earth/europe/slovakia/bratislava.html' ),
            upath.join('tree/earth/europe/germany/berlin.js' ),
            upath.join('tree/earth/europe/germany/dresden.test.js'),
            upath.join('tree/earth/europe/czech republic/brno.js'),
            upath.join('tree/earth/europe/czech republic/prague.html'),
            upath.join('tree/earth/australia/oceania.config.js'),
            upath.join('tree/earth/asia/india.js'),
            upath.join('tree/earth/asia/japan.html'),
            upath.join('tree/earth/asia/taiwan.test.js'),
            upath.join('tree/earth/africa/spec/spec.spec.js')
        ];

        const actual = FileManager.getListOfFiles('tree', ['**/*.html', '**/*.js']);
        expect(actual).to.have.all.members(expected);
    });

    it('Returns only html and js files, except *config.js and *test.js and *spec.js', function () {
        const expected = [
            upath.join('tree/plugins/lint.js' ),
            upath.join('tree/plugins/publish-html.html' ),
            upath.join('tree/plugins/standard.js' ),
            upath.join('tree/earth/europe/slovakia/bratislava.html' ),
            upath.join('tree/earth/europe/germany/berlin.js' ),
            upath.join('tree/earth/europe/czech republic/brno.js'),
            upath.join('tree/earth/europe/czech republic/prague.html'),
            upath.join('tree/earth/asia/india.js'),
            upath.join('tree/earth/asia/japan.html'),
        ];

        const actual = FileManager.getListOfFiles('tree', ['**/*.(html|js)'], ['**/*.(spec|config|test).js']);
        expect(actual).to.have.all.members(expected);
    });

    it('returns empty array when path is of wrong type', function () {
        expect( FileManager.getListOfFiles(0) ).to.be.empty;
        expect( FileManager.getListOfFiles('') ).to.be.empty;
        expect( FileManager.getListOfFiles() ).to.be.empty;
        expect( FileManager.getListOfFiles(['some', 'path']) ).to.be.empty;
    });

    it('ignores wrong type of includes/excludes', function () {
        const expected = [
            upath.join('tree/plugins/lint.js'),
            upath.join('tree/plugins/publish-html.html'),
            upath.join('tree/plugins/standard.js'),
            upath.join('tree/plugins/typescript.ts'),
            upath.join('tree/earth/zealandia/middle earth.config.ts'),
            upath.join('tree/earth/south america/test/test.test.ts'),
            upath.join('tree/earth/north america/node_modules/node'),
            upath.join('tree/earth/europe/slovakia/bratislava.html'),
            upath.join('tree/earth/europe/germany/berlin.js'),
            upath.join('tree/earth/europe/germany/dortmund.ts'),
            upath.join('tree/earth/europe/germany/dresden.test.js'),
            upath.join('tree/earth/europe/czech republic/brno.js'),
            upath.join('tree/earth/europe/czech republic/pilsen.test.ts'),
            upath.join('tree/earth/europe/czech republic/prague.html'),
            upath.join('tree/earth/australia/oceania.config.js'),
            upath.join('tree/earth/asia/india.js'),
            upath.join('tree/earth/asia/japan.html'),
            upath.join('tree/earth/asia/taiwan.test.js'),
            upath.join('tree/earth/africa/spec/spec.spec.js')
        ];
        
        const actual = FileManager.getListOfFiles('tree', '**/*.html', '**/*.js');
        expect(actual).to.have.all.members(expected);
    });

    it('ignores wrong type of excludes', function () {
        const expected = [
            upath.join('tree/plugins/publish-html.html' ),
            upath.join('tree/earth/europe/slovakia/bratislava.html' ),
            upath.join('tree/earth/europe/czech republic/prague.html'),
            upath.join('tree/earth/asia/japan.html'),
        ];

        const actual = FileManager.getListOfFiles('tree', ['**/*.html'], '**/*.js');
        expect(actual).to.have.all.members(expected);
    });

    it('ignores wrong type of includes', function () {
        it('Returns only html and js files, except *config.js and *test.js and *spec.js', function () {
            const expected = [
                upath.join('tree/plugins/lint.js'),
                upath.join('tree/plugins/publish-html.html'),
                upath.join('tree/plugins/standard.js'),
                upath.join('tree/plugins/typescript.ts'),
                upath.join('tree/earth/zealandia/middle earth.config.ts'),
                upath.join('tree/earth/south america/test/test.test.ts'),
                upath.join('tree/earth/north america/node_modules/node'),
                upath.join('tree/earth/europe/slovakia/bratislava.html'),
                upath.join('tree/earth/europe/germany/berlin.js'),
                upath.join('tree/earth/europe/germany/dortmund.ts'),
                upath.join('tree/earth/europe/germany/dresden.test.js'),
                upath.join('tree/earth/europe/czech republic/brno.js'),
                upath.join('tree/earth/europe/czech republic/pilsen.test.ts'),
                upath.join('tree/earth/europe/czech republic/prague.html'),
                upath.join('tree/earth/australia/oceania.config.js'),
                upath.join('tree/earth/asia/india.js'),
                upath.join('tree/earth/asia/japan.html'),
                upath.join('tree/earth/asia/taiwan.test.js'),
                upath.join('tree/earth/africa/spec/spec.spec.js')
            ];
    
            const actual = FileManager.getListOfFiles('tree', '**/*.(html|js)');
            expect(actual).to.have.all.members(expected);
        });
    });
});
