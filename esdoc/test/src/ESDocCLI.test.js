import ESDocCLI from '../../out/ESDocCLI';
import process from 'process';
import fs from 'fs-extra';
import assert from 'assert';
import path from 'path';

describe('test ESDocCLI:', function () {
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
    it('finds -c', function () {
      const cli = new ESDocCLI([null, null, '-c', 'esdoc.json']);
      assert.equal(cli._findConfigFilePath(), 'esdoc.json');
    });

    it('finds .esdoc.json', function () {
      process.chdir('./test/');
      fs.writeFileSync('.esdoc.json', 'dummy');
      const cli = new ESDocCLI([null, null]);
      assert.equal(cli._findConfigFilePath(), path.resolve('.esdoc.json'));
      fs.unlinkSync('.esdoc.json');
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
  });
});
