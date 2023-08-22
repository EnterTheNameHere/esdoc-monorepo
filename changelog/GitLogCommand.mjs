import { exec } from 'node:child_process';
import ansiColor from 'ansi-colors';

async function helperRunCommand(command) {
  return new Promise( (resolve, reject) => {
    const stdoutOutput = [], stderrOutput = [];
    const childProcess = exec(command);
    
    childProcess.stdout.on('data', (output) => {
      stdoutOutput.push( output.toString('utf-8') );
    });
    childProcess.stderr.on('data', (output) => {
      stderrOutput.push( output.toString('utf-8') );
    });
    
    childProcess.on('error', (error) => {
      // Error is returned as error property. The rest needs to be returned too.
      // eslint-disable-next-line prefer-promise-reject-errors
      reject( { error: error, code: error.code, std: { out: stdoutOutput, err: stderrOutput } } );
    });
    
    childProcess.on('close', (code) => {
      resolve( { error: null, code: code, std: { out: stdoutOutput, err: stderrOutput } } );
    });
  });
}

export class GitLogCommand {
  prettyFormatStartTag = '@start@';
  prettyFormatEndTag = '@end@';
  prettyFormatSeparatorTag = '@sep@';
  
  data = [];
  dataOrder = [];  
  
  /**
   * Returns the string command which will be used to run the git log.
   * @returns {string}
  */
  constructGitLogCommand() {
    const command = 'git log --pretty=format:';
    let prettyFormatPlaceholders = [];
    let gitOptions = '';
    
    this.dataOrder = [];
    for(const entry of this.data.values()) {
      // Prepare pretty format placeholders.
      if(typeof entry.placeholder === 'string') {
        prettyFormatPlaceholders.push(entry.placeholder);
        // Store where in commit data array will this placeholder be so we can easily retrieve it when processing result...
        this.dataOrder.push({index: prettyFormatPlaceholders.length - 1, ...entry});
      }
      
      // Prepare options, that is anything like --max-count=100
      if(typeof entry.option === 'string') {
        gitOptions += entry.option;
        if(Object.prototype.hasOwnProperty.call(entry, 'value')) {
          gitOptions += `=${entry.value}`;
        }
        gitOptions += ' ';
      }
    }
    
    prettyFormatPlaceholders = [
      this.prettyFormatStartTag,
      prettyFormatPlaceholders.join(this.prettyFormatSeparatorTag),
      this.prettyFormatEndTag
    ];
    
    return `${command + prettyFormatPlaceholders.join('')} ${gitOptions}`;
  }
  
  /**
   * Add option like --max-count=100 to the git log command. `name` in this case
   * would be max-count and `value` would be 100. Value is optional for options
   * which do not require value.
   * @param {string} name 
   * @param {object} [value=null] 
  */
 addOption(name, value = null) {
   console.debug(ansiColor.magenta('GitLogCommand#addOption'), name, value);
   
   if(typeof name !== 'string') throw new TypeError('A string is expected!');
   const lName = name.startsWith('--') ? name : `--${name}`;
   const entry = {option: lName};
   if(value !== null) {
     entry.value = value;
    }
    
    this.data.push(entry);
  }
  
  /**
   * @param {GitCommitData} data 
   */
  include(data) {
    if(!data) throw new TypeError('One of GitCommitData fields is expected as an argument.');
    if(!Object.prototype.hasOwnProperty.call(data, 'name')) throw new TypeError('Argument must be an object with "name" property.');
    if(typeof data.name !== 'string') throw new TypeError('Argument\'s "name" property must be a string.');
    if(!Object.prototype.hasOwnProperty.call(data, 'placeholder')) throw new TypeError('Argument must be an object with "placeholder" property.');
    if(typeof data.placeholder !== 'string') throw new TypeError('Argument\'s "placeholder" property must be a string.');
    
    this.data.push(data);
  }
  
  /**
   * Runs git log command and returns the result.
   */
  async runGitLogCommand() {
    const command = this.constructGitLogCommand();
    
    const result = await helperRunCommand(command + ' 4552a25fd7b227b4b5df5d00c11f0c2e7eb3f81f');
    result.std.out = [
      '@start@4552a25fd7b227b4b5df5d00c11f0c2e7eb3f81f@sep@v2.5.2@sep@dependabot[bot]@sep@49699333+dependabot[bot]@users.noreply.github.com@sep@1689183212@sep@GitHub@sep@noreply@github.com@sep@1689183212@sep@build(deps)!: bump json5 from 1.0.1 to 1.0.2@sep@build(deps)!: bump json5 from 1.0.1 to 1.0.2\n' +
      '\n' +
      'Bumps [json5](https://github.com/json5/json5) from 1.0.1 to 1.0.2.\n' +
      '- [Release notes](https://github.com/json5/json5/releases)\n' +
      '- [Changelog](https://github.com/json5/json5/blob/main/CHANGELOG.md)\n' +
      '- [Commits](https://github.com/json5/json5/compare/v1.0.1...v1.0.2)\n' +
      '\n' +
      '---\n' +
      'updated-dependencies:\n' +
      '- dependency-name: json5\n' +
      '  dependency-type: indirect\n' +
      '...\n' +
      '\n' +
      'Signed-off-by: dependabot[bot] <support@github.com>@end@\n' +
      'package-lock.json\n',
      '\n',
      '@start@0ee25c8178d3d65f64edea28107a65dc3aecb418@sep@v2.5.2@sep@EnterTheNameHere Bohemian@sep@email@enterthenamehere.com@sep@1689183159@sep@GitHub@sep@noreply@github.com@sep@1689183159@sep@Merge pull request #21 from EnterTheNameHere/dependabot/npm_and_yarn/semver-5.7.2@sep@Merge pull request #21 from EnterTheNameHere/dependabot/npm_and_yarn/semver-5.7.2\n' +
      '\n' +
      'build(deps): bump semver from 5.7.1 to 5.7.2@end@',
      '\n',
      '@start@763d4ca8318577e84d80df9ec0f8f0849727e4b3@sep@v2.5.2@sep@dependabot[bot]@sep@49699333+dependabot[bot]@users.noreply.github.com@sep@1689064961@sep@GitHub@sep@noreply@github.com@sep@1689064961@sep@build(deps): bump semver from 5.7.1 to 5.7.2\n@sep@build(deps): bump semver from 5.7.1 to 5.7.2\n' +
      '\n' +
      'Bumps [semver](https://github.com/npm/node-semver) from 5.7.1 to 5.7.2.\n' +
      '- [Release notes](https://github.com/npm/node-semver/releases)\n' +
      '- [Changelog](https://github.com/npm/node-semver/blob/v5.7.2/CHANGELOG.md)\n' +
      '- [Commits](https://github.com/npm/node-semver/compare/v5.7.1...v5.7.2)\n' +
      '\n' +
      '---\n' +
      'updated-dependencies:\n' +
      '- dependency-name: semver\n' +
      '  dependency-type: indirect\n' +
      '...\n' +
      '\n' +
      'BREAKING-CHANGE: this is footer\n' +
      'Signed-off-by: one[bot] <one@github.com>\n' +
      'Approved-by: two[bot] <two@github.com>\n' +
      'Read-by: three[bot] <three@github.com>\n' +
      'Written-by: four[bot] <four@github.com>\n' +
      'Bored-by: five[bot] <five@github.com>@end@\n' +
      'package-lock.json\n' +
      '\n',
      "@start@8d416eda69d1e057980204be24e901b06d174ad8@sep@v2.5.2@sep@EnterTheNameHere Bohemian@sep@email@enterthenamehere.com@sep@1666794776@sep@EnterTheNameHere Bohemian@sep@email@enterthenamehere.com@sep@1666794776@sep@Merge branch 'main' of https://github.com/enterthenamehere/esdoc-monorepo@sep@Merge branch 'main' of https://github.com/enterthenamehere/esdoc-monorepo\n" +
      '@end@',
      '\n',
      '@start@f08f9be1bec897acde3fb192cbec60f07fba4449@sep@v2.5.2@sep@EnterTheNameHere Bohemian@sep@email@enterthenamehere.com@sep@1666794771@sep@EnterTheNameHere Bohemian@sep@email@enterthenamehere.com@sep@1666794771@sep@build: allows running unit tests on github manually\n@sep@build: allows running unit tests on github manually\n\nBREAKING CHANGE: this is footer\n' +
      '@end@\n' +
      '.github/workflows/unit-tests.yml\n' +
      '\n',
      '@start@ad5357710f07434f5536c37bd2e0dc2f740e3ef6@sep@v2.5.2@sep@EnterTheNameHere Bohemian@sep@email@enterthenamehere.com@sep@1666790781@sep@GitHub@sep@noreply@github.com@sep@1666790781@sep@Merge pull request #20 from Timbuktu1982/patch-4@sep@Merge pull request #20 from Timbuktu1982/patch-4\n' +
      '\n' +
      'Update tag descriptors for object example@end@',
      '\n',
      '@start@ed10fbfeac030a2a438a9149c5548dbc84b68dcf@sep@v2.5.2@sep@Oliver Schmidt@sep@47846931+Timbuktu1982@users.noreply.github.com@sep@1666779554@sep@GitHub@sep@noreply@github.com@sep@1666779554@sep@Update tag descriptors for object example@sep@Update tag descriptors for object example@end@\n' +
      'packages/esdoc/manual/tags.md\n',
      '\n',
      '@start@bea8960b724acd565011e19d20e2622012c1ce8c@sep@v2.5.2@sep@EnterTheNameHere Bohemian@sep@email@enterthenamehere.com@sep@1666579098@sep@GitHub@sep@noreply@github.com@sep@1666579098@sep@Create LICENSE@sep@Create LICENSE\n' +
      '\n' +
      'docs: adds root license@end@\n' +
      'LICENSE\n',
      '\n',
      '@start@0792b527014fcb0815f4570e791d9ae894ff69f8@sep@v2.5.2@sep@EnterTheNameHere Bohemian@sep@email@enterthenamehere.com@sep@1666576353@sep@EnterTheNameHere Bohemian@sep@email@enterthenamehere.com@sep@1666576353@sep@build!: updates lerna to 6@sep@build!: updates lerna to 6\n' +
      '@end@\n' +
      'lerna.json\n' +
      'package-lock.json\n' +
      'package.json\n',
      '\n',
      '@start@8d26eb8307f86edc2efea979708a1c5f384a78d6@sep@v2.5.2@sep@EnterTheNameHere Bohemian@sep@email@enterthenamehere.com@sep@1653891082@sep@EnterTheNameHere Bohemian@sep@email@enterthenamehere.com@sep@1653891082@sep@v2.5.2@sep@v2.5.2\n' +
      '@end@\n' +
      'lerna.json\n' +
      'packages/esdoc-brand-plugin/package.json\n' +
      'packages/esdoc-inject-gtm-plugin/package.json\n' +
      'packages/esdoc-inject-script-plugin/package.json\n' +
      'packages/esdoc-inject-style-plugin/package.json\n' +
      'packages/esdoc-publish-html-plugin/package.json\n' +
      'packages/esdoc-publish-markdown-plugin/package.json\n' +
      'packages/esdoc-react-plugin/package.json\n' +
      'packages/esdoc-standard-plugin/package.json\n' +
      'packages/ice-cap/package.json\n',
      '\n'
    ];
    return result;
  }
  
  processResultToCommits(result) {
    const commits = [];
    
    if(result.std.out.length) {
      /** @type {string} */
      const stdOut = result.std.out;

      // Iterate over all outputs git log produced
      for(const stdOutEntry of stdOut) {
        // Skip newline only entries
        if(stdOutEntry === '\n') continue;
        
        // Single log should be a string like this:
        // startTag
        // followed by commit data separated by separatorTag
        // endTag
        // optional additional output generated by using options line --name-only

        // startTag and endTag should exist only once in the whole single log string
        // We can use it to perform minimal safety check about data validity
        if(!stdOutEntry.startsWith(this.prettyFormatStartTag)) throw new Error("Data integrity error: commit data should start with startTag! Continuing could end in unexpected consequences so we're bailing...");
        if((stdOutEntry.match(new RegExp(this.prettyFormatStartTag, 'gu')) || []).length !== 1) throw new Error("Data integrity error: only one startTag is expected to exist in commit data, but more or none found! Continuing could end in unexpected consequences so we're bailing...");
        if((stdOutEntry.match(new RegExp(this.prettyFormatEndTag, 'gu')) || []).length !== 1) throw new Error("Data integrity error: only one endTag is expected to exist in commit data, but more or none found! Continuing could end in unexpected consequences so we're bailing...");
        
        // Let's split what we got by endTag, so we have commit data and optional additional option data separated
        const split = stdOutEntry.split(this.prettyFormatEndTag);
        let commitText = split[0] ?? 'error';
        const additionalText = split[1] ?? '';
        
        if(commitText === 'error') throw new Error("Data integrity error: after separating commit data from possible additional data somehow ended in error! Continuing could end in unexpected consequences so we're bailing...");
        
        // Remove startTag
        commitText = commitText.substring(this.prettyFormatStartTag.length);

        // Now we can split all the whole commit data into individual items
        const commitData = commitText.split(this.prettyFormatSeparatorTag);

        // Now we can store individual items into object under requested custom property names
        const commit = {};
        // We have stored order in which placeholder data will be in commit data array when generating command string
        // Now go over each of them
        for(const entry of this.dataOrder.values()) {
          // Property name should be the name property in entry, which could have dot . in them, so following:
          // { name: "commit.author.name", value: "enter" }
          // would correspond to:
          // {
          //   commit: {
          //     author: {
          //       name: "enter"
          //     }
          //   }
          // }

          const propertyNames = entry.name.split('.');
          const numberOfParents = propertyNames.length - 1;
          let currentProperty = commit;
          for(let ii = 0; ii < numberOfParents; ii += 1) {
            if(!Object.prototype.hasOwnProperty.call(currentProperty, propertyNames[ii])) {
              currentProperty[propertyNames[ii]] = {};
            }
            currentProperty = currentProperty[propertyNames[ii]];
          }
          currentProperty[propertyNames[numberOfParents]] = commitData[entry.index];
        }
        
        commit.optionsData = additionalText;
        commits.push(commit);
      }
    }

    return commits;
  }
  
  async run() {
    const result = await this.runGitLogCommand();
    
    // Report errors we received
    if(result.error) {
      console.error(ansiColor.red(result.error));
    }
    if(result.std.err.length) {
      console.error(ansiColor.red(result.std.err.length));
    }
  
    // Process what we got to commit objects and return them to user...
    const commits = this.processResultToCommits(result);
    return commits;
  }
}
