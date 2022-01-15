import ESDoc from '../../out/ESDoc';
import assert from 'assert';

import { MockESDocTestEnvironment } from '../../../../test/esdocMock';
import path from 'path';

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
            const mock = new MockESDocTestEnvironment();
            const mockedPackageJSONFilePath = path.join(
                MockESDocTestEnvironment.MockNodeModulesPath,
                MockESDocTestEnvironment.MockNodeModulesESDocPackagePath,
                'package.json'
            );
            mock.writeToJSONFile(mockedPackageJSONFilePath, { name: '' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
        
        it( 'should return empty string 1', function() {
            const mock = new MockESDocTestEnvironment();
            const mockedPackageJSONFilePath = path.join(
                MockESDocTestEnvironment.MockNodeModulesPath,
                MockESDocTestEnvironment.MockNodeModulesESDocPackagePath,
                'package.json'
            );
            mock.writeToJSONFile(mockedPackageJSONFilePath, { name: 'esdoc' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });

        it( 'should return empty string 2', function() {
            const mock = new MockESDocTestEnvironment();
            const mockedPackageJSONFilePath = path.join(
                MockESDocTestEnvironment.MockNodeModulesPath,
                MockESDocTestEnvironment.MockNodeModulesESDocPackagePath,
                'package.json'
            );
            mock.writeToJSONFile(mockedPackageJSONFilePath, { name: null });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
        
        it( 'should return empty string 3', function() {
            const mock = new MockESDocTestEnvironment();
            const mockedPackageJSONFilePath = path.join(
                MockESDocTestEnvironment.MockNodeModulesPath,
                MockESDocTestEnvironment.MockNodeModulesESDocPackagePath,
                'package.json'
            );
            mock.writeToJSONFile(mockedPackageJSONFilePath, { name: undefined });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });

        it( 'should return empty string 4', function() {
            const mock = new MockESDocTestEnvironment();
            const mockedPackageJSONFilePath = path.join(
                MockESDocTestEnvironment.MockNodeModulesPath,
                MockESDocTestEnvironment.MockNodeModulesESDocPackagePath,
                'package.json'
            );
            mock.writeToJSONFile(mockedPackageJSONFilePath, { name: 42 });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
        
        it( 'should return correct prefix 1', function() {
            const mock = new MockESDocTestEnvironment();
            const mockedPackageJSONFilePath = path.join(
                MockESDocTestEnvironment.MockNodeModulesPath,
                MockESDocTestEnvironment.MockNodeModulesESDocPackagePath,
                'package.json'
            );
            mock.writeToJSONFile(mockedPackageJSONFilePath, { name: '@enterthenamehere/esdoc' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '@enterthenamehere' );
            mock.clean();
        });
        
        it( 'should return correct prefix 2', function() {
            const mock = new MockESDocTestEnvironment();
            const mockedPackageJSONFilePath = path.join(
                MockESDocTestEnvironment.MockNodeModulesPath,
                MockESDocTestEnvironment.MockNodeModulesESDocPackagePath,
                'package.json'
            );
            mock.writeToJSONFile(mockedPackageJSONFilePath, { name: '@otherprefix/esdoc' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '@otherprefix' );
            mock.clean();
        });
        
        it( 'should return probably incorrect prefix', function() {
            const mock = new MockESDocTestEnvironment();
            const mockedPackageJSONFilePath = path.join(
                MockESDocTestEnvironment.MockNodeModulesPath,
                MockESDocTestEnvironment.MockNodeModulesESDocPackagePath,
                'package.json'
            );
            mock.writeToJSONFile(mockedPackageJSONFilePath, { name: '@this/@is/@probably/@incorrect/esdoc' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '@this/@is/@probably/@incorrect' );
            mock.clean();
        });
        
        it( 'should return empty with different name containing /esdoc', function() {
            const mock = new MockESDocTestEnvironment();
            const mockedPackageJSONFilePath = path.join(
                MockESDocTestEnvironment.MockNodeModulesPath,
                MockESDocTestEnvironment.MockNodeModulesESDocPackagePath,
                'package.json'
            );
            mock.writeToJSONFile(mockedPackageJSONFilePath, { name: '@malformed/esdoc-plugin-name-for-some-reason' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
        
        it( 'should return empty with malformed packaged name', function() {
            const mock = new MockESDocTestEnvironment();
            const mockedPackageJSONFilePath = path.join(
                MockESDocTestEnvironment.MockNodeModulesPath,
                MockESDocTestEnvironment.MockNodeModulesESDocPackagePath,
                'package.json'
            );
            mock.writeToJSONFile(mockedPackageJSONFilePath, { name: 'esdoc/esdoc' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
        
        it( 'should return empty string if package name is different 1', function() {
            const mock = new MockESDocTestEnvironment();
            const mockedPackageJSONFilePath = path.join(
                MockESDocTestEnvironment.MockNodeModulesPath,
                MockESDocTestEnvironment.MockNodeModulesESDocPackagePath,
                'package.json'
            );
            mock.writeToJSONFile(mockedPackageJSONFilePath, { name: 'esdoc/name' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
        
        it( 'should return empty string if package name is different 2', function() {
            const mock = new MockESDocTestEnvironment();
            const mockedPackageJSONFilePath = path.join(
                MockESDocTestEnvironment.MockNodeModulesPath,
                MockESDocTestEnvironment.MockNodeModulesESDocPackagePath,
                'package.json'
            );
            mock.writeToJSONFile(mockedPackageJSONFilePath, { name: '@differect/name' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
        
        it( 'should return empty string if package name is different 3', function() {
            const mock = new MockESDocTestEnvironment();
            const mockedPackageJSONFilePath = path.join(
                MockESDocTestEnvironment.MockNodeModulesPath,
                MockESDocTestEnvironment.MockNodeModulesESDocPackagePath,
                'package.json'
            );
            mock.writeToJSONFile(mockedPackageJSONFilePath, { name: 'differentPackage' });
            assert.strictEqual( mock.ESDoc._getPackagePrefix(), '' );
            mock.clean();
        });
    });
});
