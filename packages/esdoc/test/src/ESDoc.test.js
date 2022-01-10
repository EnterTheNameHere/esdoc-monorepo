import ESDoc from '../../out/ESDoc';
import assert from 'assert';
import fs from 'fs-extra';

import { MockESDocTestEnvironment } from '../utils';

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
                assert.fail('generate() didn\'t throw exception!');
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
        
        it('should throw Error when config object is missing source property', function () {
            console.error = function() {};
            try {
                ESDoc.generate( {} );
                assert.fail('generate() didn\'t throw exception!');
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
        
        it('should throw Error when config object source property is not string', function () {
            console.error = function() {};
            try {
                ESDoc.generate( { source: 0 } );
                assert.fail('generate() didn\'t throw exception!');
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
        
        it('should throw Error when config object source property is empty string', function () {
            console.error = function() {};
            try {
                ESDoc.generate( { source: '' } );
                assert.fail('generate() didn\'t throw exception!');
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
        
        it('should throw Error when config object is missing destination property', function () {
            console.error = function() {};
            try {
                ESDoc.generate( { source: '.' } );
                assert.fail('generate() didn\'t throw exception!');
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
        
        it('should throw Error when config object destination property is not string', function () {
            console.error = function() {};
            try {
                ESDoc.generate( { source: '.', destination: 0 } );
                assert.fail('generate() didn\'t throw exception!');
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
        
        it('should throw Error when config object destination property is empty string', function () {
            console.error = function() {};
            try {
                ESDoc.generate( { source: '.', destination: '' } );
                assert.fail('generate() didn\'t throw exception!');
            } catch( err ) {
                assert( err instanceof Error );
            }
            console.error = originalError;
        });
    });
    
    describe('package prefix', function () {
        it( 'should return empty string 1', function() {
            const mock = new MockESDocTestEnvironment('packagePrefixTest');
            mock.writeToJSONFile('package.json', { name: '' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
        
        it( 'should return empty string 1', function() {
            const mock = new MockESDocTestEnvironment('packagePrefixTest');
            mock.writeToJSONFile('package.json', { name: 'esdoc' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });

        it( 'should return empty string 2', function() {
            const mock = new MockESDocTestEnvironment('packagePrefixTest');
            mock.writeToJSONFile('package.json', { name: null });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
        
        it( 'should return empty string 3', function() {
            const mock = new MockESDocTestEnvironment('packagePrefixTest');
            mock.writeToJSONFile('package.json', { name: undefined });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });

        it( 'should return empty string 4', function() {
            const mock = new MockESDocTestEnvironment('packagePrefixTest');
            mock.writeToJSONFile('package.json', { name: 42 });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
        
        it( 'should return correct prefix 1', function() {
            const mock = new MockESDocTestEnvironment('packagePrefixTest');
            mock.writeToJSONFile('package.json', { name: '@enterthenamehere/esdoc' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '@enterthenamehere' );
            mock.clean();
        });
        
        it( 'should return correct prefix 2', function() {
            const mock = new MockESDocTestEnvironment('packagePrefixTest');
            mock.writeToJSONFile('package.json', { name: '@otherprefix/esdoc' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '@otherprefix' );
            mock.clean();
        });
        
        it( 'should return probably incorrect prefix', function() {
            const mock = new MockESDocTestEnvironment('packagePrefixTest');
            mock.writeToJSONFile('package.json', { name: '@this/@is/@probably/@incorrect/esdoc' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '@this/@is/@probably/@incorrect' );
            mock.clean();
        });
        
        it( 'should return empty with different name containing /esdoc', function() {
            const mock = new MockESDocTestEnvironment('packagePrefixTest');
            mock.writeToJSONFile('package.json', { name: '@malformed/esdoc-plugin-name-for-some-reason' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
        
        it( 'should return empty with malformed packaged name', function() {
            const mock = new MockESDocTestEnvironment('packagePrefixTest');
            mock.writeToJSONFile('package.json', { name: 'esdoc/esdoc' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
        
        it( 'should return empty string if package name is different 1', function() {
            const mock = new MockESDocTestEnvironment('packagePrefixTest');
            mock.writeToJSONFile('package.json', { name: 'esdoc/name' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
        
        it( 'should return empty string if package name is different 2', function() {
            const mock = new MockESDocTestEnvironment('packagePrefixTest');
            mock.writeToJSONFile('package.json', { name: '@differect/name' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
        
        it( 'should return empty string if package name is different 3', function() {
            const mock = new MockESDocTestEnvironment('packagePrefixTest');
            mock.writeToJSONFile('package.json', { name: 'differentPackage' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
    });
});
