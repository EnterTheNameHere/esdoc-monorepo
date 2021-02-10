import ESDoc from '../../out/ESDoc';
import assert from 'assert';

describe('ESDoc test:', function () {
    describe('generate()', function () {
        const originalError = console.error;
        
        it('should throw Error when no argument is passed', function () {
            console.error = function() {};
            try {
                ESDoc.generate();
                assert.fail('generate() didn\'t throw exception!')
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
});
