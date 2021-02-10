import ESDoc from '../../out/ESDoc';
import assert from 'assert';
import fs from 'fs-extra';

describe('ESDoc test:', function () {
    describe('generate()', function () {
        const originalError = console.error;
        
        it('should throw Error when no argument is passed', function () {
            console.error = function() {};
            try {
                ESDoc.generate();
                assert.fail('generate() didn\'t throw exception!');
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
        
        it('should throw Error if null is passed as an argument', function () {
            console.error = function() {};
            try {
                ESDoc.generate( null );
                assert.fail('generate() didn\'t throw exception!')
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
        
        it('should throw Error when config object is missing source property', function () {
            console.error = function() {};
            try {
                ESDoc.generate( {} );
                assert.fail('generate() didn\'t throw exception!')
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
        
        it('should throw Error when config object source property is not string', function () {
            console.error = function() {};
            try {
                ESDoc.generate( { source: 0 } );
                assert.fail('generate() didn\'t throw exception!')
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
        
        it('should throw Error when config object source property is empty string', function () {
            console.error = function() {};
            try {
                ESDoc.generate( { source: '' } );
                assert.fail('generate() didn\'t throw exception!')
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
        
        it('should throw Error when config object is missing destination property', function () {
            console.error = function() {};
            try {
                ESDoc.generate( { source: '.' } );
                assert.fail('generate() didn\'t throw exception!')
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
        
        it('should throw Error when config object destination property is not string', function () {
            console.error = function() {};
            try {
                ESDoc.generate( { source: '.', destination: 0 } );
                assert.fail('generate() didn\'t throw exception!')
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
        
        it('should throw Error when config object destination property is empty string', function () {
            console.error = function() {};
            try {
                ESDoc.generate( { source: '.', destination: '' } );
                assert.fail('generate() didn\'t throw exception!')
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
    });
    
    describe('package prefix', function () {
        const testPackagePrefix = ( packageName, expectedPrefix ) => function() {
            fs.ensureDir('test_tmp/packagePrefixTest')
            .then( () => {
                fs.copy('../../out/ESDOC.js', 'test_tmp/packagePrefixTest/out/ESDOC.js')
                .then( () => {
                    fs.writeJson('test_tmp/packagePrefixTest/package.json', { name: packageName } , { mode: 'w' })
                    .then( () => {
                        const tmpESDOC = require('test_tmp/packagePrefixTest/out/ESDoc');
                        assert.strictEquals(tmpESDOC._getPackagePrefix(), expectedPrefix);
                    })
                    .catch( (err) => {
                        assert(false, err.message);
                    });
                })
                .catch( (err) => {
                    assert(false, err.message);
                });
            }).catch( (err) => {
                assert(false, err.message);
            });
            
            fs.remove('test_tmp')
            .catch( (err) => {
                assert.fail('Cannot delete test_tmp directory! Results of other tests cannot be guaranteed. ' + err.message);
            });
        }
        
        it( 'should return empty string 1', testPackagePrefix('', '') );
        it( 'should return empty string 1', testPackagePrefix('esdoc', '') );
        it( 'should return empty string 2', testPackagePrefix(null, '') );
        it( 'should return empty string 3', testPackagePrefix(undefined, '') );
        it( 'should return empty string 4', testPackagePrefix(42, '') );
        
        it( 'should return correct prefix 1', testPackagePrefix('@enterthenamehere/esdoc', '@enterthenamehere') );
        it( 'should return correct prefix 2', testPackagePrefix('@otherprefix/esdoc', '@otherprefix') );
        
        it( 'should return probably incorrect prefix', testPackagePrefix('@this/@is/@probably/@incorrect/esdoc', '@this/@is/@probably/@incorrect') );
        
        it( 'should return empty with different name containing /esdoc', testPackagePrefix('@malformed/esdoc-plugin-name-for-some-reason', '') );
        it( 'should return even with malformed packaged name', testPackagePrefix('esdoc/esdoc', 'esdoc') );
        
        it( 'should return empty string if package name is different 1', testPackagePrefix('esdoc/name', '') );
        it( 'should return empty string if package name is different 2', testPackagePrefix('@differect/name', '') );
        it( 'should return empty string if package name is different 3', testPackagePrefix('differentPackage', '') );
    });
});
