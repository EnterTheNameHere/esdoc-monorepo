// import upath from 'upath';
// import { expect } from 'chai';
// import { fileNameToDescription } from '../../../util.js';

// import { InvalidOptionsSchemaDefinitionError } from '../../../../src/options/OptionsManagerErrors.js';
// import { OptionsManager } from '../../../../src/options/OptionsManager.js';

// describe(fileNameToDescription(__filename), function () {
//   describe('processOptions()', function () {
//     it('throws error if schema is empty.', function () {
//       expect(() => { new OptionsManager().processOptions({}, {}); }).to.throw(InvalidOptionsSchemaDefinitionError);
//     });
    
//     it('can process single boolean schema', function () {
//       const schema = [{
//         name: 'debug',
//         type: 'boolean',
//       }];
      
//       const options = {
//         debug: true,
//       };
      
//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.debug).to.equal(true);
//     });

//     it('can process single number schema', function () {
//       const schema = [{
//         name: 'theNumber',
//         type: 'number',
//       }];

//       const options = {
//         theNumber: 42,
//       };

//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.theNumber).to.equal(42);
//     });

//     it('can process single string schema', function () {
//       const schema = [{
//         name: 'color',
//         type: 'string',
//       }];

//       const options = {
//         color: 'Orange',
//       };

//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.color).to.equal('Orange');
//     });

//     it('can process single array of strings schema', function () {
//       const schema = [{
//         name: 'multiple',
//         type: 'array',
//         ofType: 'string'
//       }];

//       const options = {
//         multiple: ['strings', 'in', 'here'],
//       };

//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.multiple).to.have.same.members(['strings', 'in', 'here']);
//     });

//     it('can process single array of strings schema', function () {
//       const schema = [{
//         name: 'apolloWhichLandedOnMoon',
//         type: 'array',
//         ofType: 'number'
//       }];
      
//       const options = {
//         apolloWhichLandedOnMoon: [11, 12, 14, 15, 16, 17],
//       };

//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.apolloWhichLandedOnMoon).to.have.same.members([11, 12, 14, 15, 16, 17]);
//     });
    
//     it('can process various directories', function () {
//       const schema = [{
//         name: 'directories',
//         type: 'array',
//         ofType: 'path'
//       }];

//       const options = {
//         directories: [
//           'c:/windows/nodejs/path',
//           'c:/windows/../nodejs/path',
//           'c:\\windows\\nodejs\\path',
//           'c:\\windows\\..\\nodejs\\path',
//           '/windows\\unix/mixed',
//           '\\windows//unix/mixed',
//           '\\windows\\..\\unix/mixed/'
//         ]
//       };

//       const expected = [
//         upath.normalize('c:/windows/nodejs/path'),
//         'c:/nodejs/path',
//         'c:/windows/nodejs/path',
//         'c:/nodejs/path',
//         '/windows/unix/mixed',
//         '/windows/unix/mixed',
//         '/unix/mixed/'
//       ];
      
//       const result = new OptionsManager().processOptions(schema, options);
//       console.log('result: %O', result);
//       expect(result.config.directories).to.have.same.members(expected);
//     });

//     it('can process single path schema', function () {
//       const schema = [{
//         name: 'directory',
//         type: 'path',
//       }];
      
//       const options = {
//         directory: 'd:\\should\\be\\normalized\\',
//       };
      
//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.directory).to.equal('d:/should/be/normalized/');
//     });
    
//     it('can process single path schema', function () {
//       const schema = [{
//         name: 'directories',
//         type: 'array',
//         ofType: 'path'
//       }];

//       const options = {
//         directories: ['d:\\should\\be\\normalized\\', 'foo/../bar', './foo\\bar'],
//       };

//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.directories).to.have.same.members([
//         upath.normalize('d:/should/be/normalized/'),
//         upath.normalize('foo\\..\\bar'),
//         upath.normalize('.\\foo/bar')
//       ]);
//     });

//     it('can process single string with default value schema with empty options', function () {
//       const schema = [{
//         name: 'value',
//         type: 'string',
//         defaultValue: 'thisIsDefaultValue'
//       }];

//       const options = {
//       };

//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.value).to.equal('thisIsDefaultValue');
//     });

//     it('can process single string with default value schema with non-empty options', function () {
//       const schema = [{
//         name: 'drink',
//         type: 'string',
//         defaultValue: 'pinacolada'
//       }];

//       const options = {
//         drink: 'cola'
//       };
      
//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.drink).to.equal('cola');
//     });
    
//     it('can process single number with default value schema with empty options', function () {
//       const schema = [{
//         name: 'fucksGiven',
//         type: 'number',
//         defaultValue: 0
//       }];
      
//       const options = {
//       };
      
//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.fucksGiven).to.equal(0);
//     });
    
//     it('can process single number with default value schema with non-empty options', function () {
//       const schema = [{
//         name: 'day',
//         type: 'number',
//         defaultValue: 1
//       }];
      
//       const options = {
//         day: 7
//       };
      
//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.day).to.equal(7);
//     });
    
//     it('can process single bool with default value schema with empty options', function () {
//       const schema = [{
//         name: 'isThisTrue',
//         type: 'boolean',
//         defaultValue: true
//       }];
      
//       const options = {
//       };
      
//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.isThisTrue).to.equal(true);
//     });
    
//     it('can process single bool with default value schema with non-empty options', function () {
//       const schema = [{
//         name: 'doIWannaSleep',
//         type: 'boolean',
//         defaultValue: false
//       }];
      
//       const options = {
//         doIWannaSleep: true
//       };
      
//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.doIWannaSleep).to.equal(true);
//     });
    
//     it('can process array of paths with default value schema with empty options', function () {
//       const schema = [{
//         name: 'includes',
//         type: 'array',
//         ofType: 'path',
//         defaultValue: ['d:/developers/unite', 'foo\\..\\bar']
//       }];
      
//       const options = {
//       };
      
//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.includes).to.have.same.members([
//         'd:/developers/unite',
//         'bar',
//       ]);
//     });
    
//     it('can process single array of paths with default value schema with non-empty options', function () {
//       const schema = [{
//         name: 'excludes',
//         type: 'array',
//         ofType: 'path',
//         defaultValue: ['d:/developers/unite', 'foo\\..\\bar']
//       }];
      
//       const options = {
//         excludes: ['node_modules', 'out\\*\\**']
//       };
      
//       const result = new OptionsManager().processOptions(schema, options);
      
//       expect(result.config?.excludes).to.have.same.members([
//         'node_modules',
//         'out/*/**',
//       ]);
//     });
    
//     it('successfully processes ESDoc schema', function () {
//       let brandOptionsSchema = [
//         {
//           name: 'name',
//           alias: 'path',
//           type: 'string',
//           required: true,
//         },
//         {
//           name: 'options',
//           alias: 'option',
//           type: 'object',
//           schema: [
//             {
//               name: 'logo',
//               type: 'string',
//               required: false,
//             },
//             {
//               name: 'title',
//               type: 'string',
//               required: false,
//             },
//             {
//               name: 'description',
//               type: 'string',
//               required: false,
//             },
//             {
//               name: 'repository',
//               type: 'string',
//               required: false,
//             },
//             {
//               name: 'author',
//               type: 'any',
//               required: false,
//             },
//             {
//               name: 'image',
//               type: 'string',
//               required: false,
//             }
//           ],
//           defaultValue: {}
//         }
//       ];
      
//       let esdocOptionsSchema = [
//         {
//           name: 'source',
//           alias: 'sources',
//           type: 'array',
//           of: 'string',
//           required: true,
//         },
//         {
//           name: 'destination',
//           alias: 'dest',
//           type: 'string',
//           required: true,
//         },
//         {
//           name: 'exclude',
//           alias: 'excludes',
//           type: 'array',
//           of: 'string',
//         },
//         {
//           name: 'include',
//           alias: 'includes',
//           type: 'array',
//           of: 'string',
//         },
//         {
//           name: 'debug',
//           type: 'boolean',
//           defaultValue: false,
//         },
//         {
//           name: 'verbose',
//           type: 'boolean',
//           defaultValue: false,
//         },
//         {
//           name: 'index',
//           type: 'string',
//           defaultValue: './README.md'
//         },
//         {
//           name: 'package',
//           alias: 'package.json',
//           defaultValue: './package.json'
//         },
//         {
//           name: 'plugins',
//           alias: 'plugin',
//           type: [
//             {
//               transform: 'string',
//               to: (value) => { return {name: value, options: {}}; }
//             },
//             {
//               transform: 'array',
//               to: (value) => { return {name: value[0], options: value[1]}; }
//             },
//             'any'
//           ]
//         }
//       ];
      
//       const esdocConfig = {
//         source: ['./src1', './src2', './vendor/src3'],
//         destination: './out/docs',
//         excludes: ['data/Builder/template/', 'node_modules'],
//         debug: false,
//         verbose: true,
//         index: './README.md',
//         package: './package.json',
//         plugins: [
//           {
//             name: '@enterthenamehere/esdoc-standard-plugin',
//             option: {
//               brand: {
//                 'title': 'ESDoc',
//                 'logo': './manual/asset/image/logo.png'
//               },
//               test: {
//                 'source': './test',
//                 'includesUseRegex': true,
//                 'includes': ['\\.test\\.js$']
//               },
//               manual: {
//                 index: './README.md',
//                 asset: './manual/asset',
//                 files: [
//                   './manual/usage.md',
//                   './manual/feature.md',
//                   './manual/tags.md',
//                   './manual/config.md',
//                   './manual/api.md',
//                   './manual/faq.md',
//                   './manual/migration.md',
//                   './CHANGELOG.md'
//                 ]
//               }
//             }
//           },
//           [
//             '@enterthenamehere/esdoc-importpath-plugin',
//             {
//               'replaces': [{'from': '^src/', 'to': 'out/src/'}]
//             }
//           ],
//           '@enterthenamehere/esdoc-external-ecmascript-plugin'
//         ]
//       };
      
//       const manager = new OptionsManager();
//       const result = manager.processOptions(esdocOptionsSchema, esdocConfig);
//       expect(result.errors.length).to.equal(0, 'result of processing should have zero errors');
//       expect(result.config?.source).to.equal([upath.normalize('./scr1'), upath.normalize('./src2'), upath.normalize('./vendor/src3')]);
//       expect(result.config?.destination).to.equal(upath.normalize('./out/docs'));
//       expect(result.config?.excludes).to.equal([upath.normalize('data/Builder/template'), upath.normalize('node_modules')]);
//       expect(result.config?.debug).to.equal(false);
//       expect(result.config?.verbose).to.equal(true);
//       expect(result.config?.index).to.equal(upath.normalize('./README.md'));
//       expect(result.config?.package).to.equal(upath.normalize('./package.json'));
//       expect(result.config?.plugins?.brand?.title).to.equal('ESDoc');
//       expect(result.config?.plugins?.brand?.logo).to.equal(upath.normalize('./manual/asset/image/logo.png'));
//       expect(result.config?.plugins?.test?.source).to.equal(upath.normalize('./test'));
//       expect(result.config?.plugins?.test?.includes).to.equal('\\.test\\.js$');
//       expect(result.config?.plugins?.test?.includesUseRegex).to.equal(true);
//       expect(result.config?.plugins?.manual?.index).to.equal(upath.normalize('./README.md'));
//       expect(result.config?.plugins?.manual?.assets).to.equal([upath.normalize('./manual/asset')]);
//       expect(result.config?.plugins?.manual?.files).to.equal([
//         upath.normalize('./manual/usage.md'),
//         upath.normalize('./manual/feature.md'),
//         upath.normalize('./manual/tags.md'),
//         upath.normalize('./manual/config.md'),
//         upath.normalize('./manual/api.md'),
//         upath.normalize('./manual/faq.md'),
//         upath.normalize('./manual/migration.md'),
//         upath.normalize('./CHANGELOG.md'),
//       ]);
//       expect(result.config?.plugins?.importpath?.replaces).to.equal([{from: '^src/', to: 'out/src/'}]);
//       expect(result.config?.plugins?.externalecmascript?.enabled).to.equal(true);
//     });
//   });
// });
