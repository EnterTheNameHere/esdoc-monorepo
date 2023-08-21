import { exec } from 'node:child_process';
import { inspect } from 'node:util';
import ansiColor from 'ansi-colors';

const origDebug = console.debug;
console.debug = function (message, ...args) {
  // eslint-disable-next-line no-console
  origDebug(ansiColor.cyan('[DEBUG] ') + ansiColor.magenta(`${console.indentLevel ?? 0} `) + message, args.map( (arg) => { return inspect(arg, false, 10, true); }).join(' ') );
};

// eslint-disable-next-line no-console
const origLog = console.log;
// eslint-disable-next-line no-console
console.log = function (message, ...args) {
  // eslint-disable-next-line no-console
  origLog(ansiColor.yellow('[  LOG] ') + ansiColor.magenta(`${console.indentLevel ?? 0} `) + message, args.map( (arg) => { return inspect(arg, false, 10, true); }).join(' ') );
};

// eslint-disable-next-line no-console
console.changeIndent = function (changeLevel) {
  // eslint-disable-next-line no-console
  if(!console.indentLevel) {
    // eslint-disable-next-line no-console
    console.indentLevel = 0;
  }
  // eslint-disable-next-line no-console
  console.indentLevel += changeLevel;
};

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

class GitCommitData {
  static HASH = { name: 'hash', placeholder: '%H' };
  static TAG = { name: 'tag', placeholder: '%(describe:abbrev=0)' };
  static AUTHOR_NAME = { name: 'author.name', placeholder: '%an' };
  static AUTHOR_EMAIL = { name: 'author.email', placeholder: '%ae' };
  static AUTHOR_TIME = { name: 'author.time', placeholder: '%at' };
  static COMMITTER_NAME = { name: 'committer.name', placeholder: '%cn' };
  static COMMITTER_EMAIL = { name: 'committer.email', placeholder: '%ce' };
  static COMMITTER_TIME = { name: 'committer.time', placeholder: '%ct' };
  static SUBJECT = { name: 'subject', placeholder: '%s' };
  static RAW_BODY = { name: 'rawBody', placeholder: '%B' };
  
  name = '';
  placeholder = '';
}

class GitLogCommand {
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

function getPackagesInvolved(commit) {
  const packagesInvolved = new Set();

  // Check if there is any data returned cause options were used
  if(commit.optionsData) {
    const lines = commit.optionsData.split('\n');
    
    for(const line of lines) {
      // File paths are one per line, so if path starts with workspace path, we can get name of package involved
      if(line.startsWith('packages/')) {
        const filePathParts = line.split('/');
        const packageName = filePathParts[1] ?? '';
        if(packageName) packagesInvolved.add(packageName);
      }
    }
  }
  
  return Array.from(packagesInvolved);
}

class ConventionalCommitParser {  
  conventionalCommitData = {
    type: null,
    scope: null,
    description: null,
    rawBody: null,
    body: null,
    rawFooter: null,
    footers: [],
    valid: true,
    breakingChange: false,
  };

  static defaultOptions = {
    debug: true,
    includeReasonWhyNotValid: true,
    trimDescription: true,
    trimBody: true,
    trimFooterValue: true,
  };
  
  static parseGitLogCommitData(commitData, options = this.defaultOptions) {
    if(!commitData.rawBody) {
      throw new TypeError('GitLogData.rawBody is required to parse conventional commit from it!');
    }
    if(typeof commitData.rawBody !== 'string') {
      throw new TypeError('GitLogData.rawBody must be a string!');
    }
    
    console.changeIndent(1);
    console.debug('Parsing git commit raw body:', commitData.rawBody);

    /**
     * @type {string}
     */
    const rawBodyText = commitData.rawBody;
    
    // Optional body can be provided after description, separated by a blank line from the header.
    let index = rawBodyText.indexOf('\n\n');
    let headerText = null;
    let bodyText = null;
    let footerText = null;
    console.debug('index of \\n\\n:', index);
    if(index !== -1) {
      // We have body
      headerText = rawBodyText.substring(0, index);
      bodyText = rawBodyText.substring(index+2);
      console.debug('headerText:', headerText);
      console.debug('bodyText:', bodyText);
      
      // Optional footer can be provided after body, separated by a blank line from the body.
      index = bodyText.lastIndexOf('\n\n');
      console.debug('index of last \\n\\n:', index);
      if(index !== -1) {
        footerText = bodyText.substring(index+2);
        bodyText = bodyText.substring(0, index);
        console.debug('footerText:', footerText);
        console.debug('bodyText:', bodyText);
      }
    } else {
      // No body, only header
      headerText = rawBodyText;
      console.debug('headerText:', headerText);
    }

    console.debug('headerText:', headerText);
    console.debug('bodyText:', bodyText);
    console.debug('footerText:', footerText);
    
    const header = headerText ? this.#parseHeader(headerText, options) : { valid: true };
    console.debug('header:', header);
    if(!header.valid) {
      console.changeIndent(-1);
      return header;
    }
    
    const footer = footerText ? this.#parseFooter(footerText, options) : { valid: true };
    console.debug('footer:', footer);
    if(!footer.valid) {
      console.changeIndent(-1);
      return footer;
    }
    
    const body = bodyText ? this.#parseBody(bodyText, options) : { valid: true };
    console.debug('body:', body);
    if(!body.valid) {
      console.changeIndent(-1);
      return body;
    }
    
    console.changeIndent(-1);
    // If breakingChange is true in one,
    // it must be true in final object, so
    // make sure of it
    let hasBreakingChange = false;
    if(!hasBreakingChange && header.breakingChange === true) hasBreakingChange = true;
    if(!hasBreakingChange && body.breakingChange === true) hasBreakingChange = true;
    if(!hasBreakingChange && footer.breakingChange === true) hasBreakingChange = true;
    return {
      ...header,
      ...(body ? body : {}),
      ...(footer ? footer : {}),
      breakingChange: hasBreakingChange,
    };
  }
  
  /**
   * 
   * @param {string} text 
   * @param {*} options 
   */
  static #parseHeader(text, options) {
    console.changeIndent(1);
    console.debug('Parsing ConventionalCommit header:', text);
    
    const result = {
      valid: true,
      type: null,
      scope: null,
      description: null,
      breakingChange: false,
    };
    
    // Commits MUST be prefixed with a type, which consists of a noun, feat, fix, etc.,
    // followed by the OPTIONAL scope, OPTIONAL !, and REQUIRED terminal colon and space.
    const separatorIndex = text.indexOf(': ');
    if(separatorIndex === -1) {
      console.debug('Separator not found.');
      console.changeIndent(-1);
      // terminal colon and space not found, not valid conventional commit
      return {
        ...{valid: false},
        ...(options.includeReasonWhyNotValid ? {reason: 'No colon and space characters found which are required to separate type/scope and description.'} : {})
      };
    }
    
    // The type feat MUST be used when a commit adds a new feature to your application or library.
    // The type fix MUST be used when a commit represents a bug fix for your application.
    
    // A scope MAY be provided after a type. A scope MUST consist of a noun describing
    // a section of the codebase surrounded by parenthesis, e.g., fix(parser):
    let tempText = text.substring(0, separatorIndex);
    console.debug('tempText', tempText);
    result.description = text.substring(separatorIndex+2);
    if(options.trimDescription) {
      result.description = result.description.trim();
    }
    console.debug('result.description', result.description);
    const parenStartIndex = tempText.indexOf('(');
    const parenEndIndex = tempText.indexOf(')', parenStartIndex+1);
    
    // Multiple ( would mean not valid scope
    let secondParenIndex = tempText.indexOf('(', parenStartIndex+1);
    if(secondParenIndex !== -1) {
      console.debug('Multiple ( found.');
      console.changeIndent(-1);
      return {
        ...{valid: false},
        ...(options?.includeReasonWhyNotValid ? {reason: 'Multiple ( found. Just one is expected.'} : {})
      };
    }
    // Multiple ) would mean not valid scope too
    secondParenIndex = tempText.indexOf(')', parenEndIndex+1);
    if(secondParenIndex !== -1) {
      console.debug('Multiple ) found.');
      console.changeIndent(-1);
      return {
        ...{valid: false},
        ...(options?.includeReasonWhyNotValid ? {reason: 'Multiple ) found. Just one is expected.'} : {})
      };
    }
    // Only ( without ) is not valid either
    if(parenStartIndex !== -1 && parenEndIndex === -1) {
      console.debug('Only ( without pairing ending ) found.');
      console.changeIndent(-1);
      return {
        ...{valid: false},
        ...(options?.includeReasonWhyNotValid ? {reason: 'Only ( without pairing ending ) found. That makes parens uneven.'} : {})
      };
    }
    // Only ) is not valid too
    if(parenStartIndex === -1 && parenEndIndex !== -1) {
      console.debug('Only ) without pairing starting ( found.');
      console.changeIndent(-1);
      return {
        ...{valid: false},
        ...(options?.includeReasonWhyNotValid ? {reason: 'Only ) without pairing starting ( found. That makes parens uneven.'} : {})
      };
    }

    // Now if we have ( and ) that's what we want
    if(parenStartIndex !== -1 && parenEndIndex !== -1) {
      result.scope = tempText.substring(parenStartIndex+1, parenEndIndex);
      tempText = tempText.replace(`(${result.scope})`, '');
    }
    
    // If included in the type/scope prefix, breaking changes MUST be indicated by a ! immediately
    // before the :. If ! is used, BREAKING CHANGE: MAY be omitted from the footer section, and the
    // commit description SHALL be used to describe the breaking change.
    // Breaking changes MUST be indicated in the type/scope prefix of a commit, or as an entry in the footer.
    if(tempText.endsWith('!')) {
      result.breakingChange = true;
      tempText = tempText.substring(0, tempText.length-1);
    } else {
      result.breakingChange = false;
    }
    console.debug('result.breakingChange', result.breakingChange);
    
    console.debug('result.scope', result.scope);
    
    result.type = tempText;
    
    console.debug('result.type', result.type);

    // Now check if type and scope are single word
    const isAWord = /^\w+$/iu;
    if(!isAWord.test(result.type)) {
      console.debug(`Parsed type is not a single word: "${result.type.length > 10 ? `${result.type.substring(0, 20)}...` : conventionalCommitData.type}"`);
      console.changeIndent(-1);
      return {
        ...{valid: false},
        ...(options?.includeReasonWhyNotValid)
          ? {reason: `Parsed type is not a single word: "${result.type.length > 10 ? `${result.type.substring(0, 20)}...` : conventionalCommitData.type}"`}
          : {}
      };
    }
    
    if(typeof result.scope === 'string' && !isAWord.test(result.scope)) {
      console.debug(`Parsed scope is not a single word: "${result.scope.length > 10 ? `${result.scope.substring(0, 20)}...` : conventionalCommitData.scope}"`);
      console.changeIndent(-1);
      return {
        ...{valid: false},
        ...(options?.includeReasonWhyNotValid)
          ? {reason: `Parsed scope is not a single word: "${result.scope.length > 10 ? `${result.scope.substring(0, 20)}...` : conventionalCommitData.scope}"`}
          : {}
      };
    }
    
    console.changeIndent(-1);
    return result;
  }
  
  /**
   * 
   * @param {string} text 
   * @param {*} options 
   */
  static #parseBody(text, options) {
    console.changeIndent(1);
    console.debug('Parsing ConventionalCommit body:', text);
    
    const body = {
      valid: true,
      body: text,
      breakingChange: false,
    };

    // Check if body contains BREAKING-CHANGE.
    let index = text.indexOf('BREAKING CHANGE');
    if(index === -1) index = text.indexOf('BREAKING-CHANGE');
    if(index !== -1) {
      body.breakingChange = true;
    }
    
    if(options.trimBody) {
      body.body = body.body.trim();
    }

    console.changeIndent(-1);
    return body;
  }
  
  /**
   * 
   * @param {string} text 
   * @param {*} options 
   */
  static #parseFooter(text, options) {
    console.changeIndent(1);
    console.debug('Parsing ConventionalCommit footer:', text);
    
    const result = {
      valid: true,
      footers: [],
      breakingChange: false,
    };
    
    let tempText = text;
    // (...) Each footer MUST consist of 
    // a word token, followed by either a :<space> or <space># separator, followed by a string value
    // (this is inspired by the git trailer convention).
    do {
      let currentTokenSeparatorIndex = tempText.indexOf(': ');
      if(currentTokenSeparatorIndex === -1) currentTokenSeparatorIndex = tempText.indexOf(' #');
      
      if(currentTokenSeparatorIndex === -1) {
        console.debug('Separator not found.');
        console.changeIndent(-1);
        return {
          ...{valid: false},
          ...(options.includeReasonWhyNotValid)
            ? {reason: 'Cannot find colon and space or space and hash which are required to separate footer token and value'}
            : {}
        };
      }
      
      const footer = {token: '', value: ''};
      const footerToken = tempText.substring(0, currentTokenSeparatorIndex);
      tempText = tempText.substring(currentTokenSeparatorIndex+2);
      
      // A footer’s token MUST use - in place of whitespace characters,
      // e.g., Acked-by (this helps differentiate the footer section from a 
      // multi-paragraph body). An exception is made for BREAKING CHANGE,
      // which MAY also be used as a token.
      if(footerToken === 'BREAKING CHANGE' || footerToken === 'BREAKING-CHANGE') {
        console.debug('BREAKING-CHANGE found.');
        footer.token = footerToken;
        result.breakingChange = true;
      } else {
        // Do not set result.breakingChange to false, just in case it's true already, which would overwrite it...
        const isAFooterToken = /^[\w-]+$/iu;
        if(!isAFooterToken.test(footerToken)) {
          console.debug(`Token found in footer is not a valid token. Token: "${typeof footerToken === 'string' ? footerToken : typeof footerToken}"`);
          console.changeIndent(-1);
          return {
            ...{valid: false},
            ...(options.includeReasonWhyNotValid)
              ? {reason: `Token found in footer is not a valid token. Token: "${typeof footerToken === 'string' ? footerToken : typeof footerToken}"`}
              : {}
          };
        }
        footer.token = footerToken;
      }
      
      // See if we find another separator of token and value, which would mean more footers...
      let nextTokenSeparatorIndex = tempText.indexOf(': ');
      if(nextTokenSeparatorIndex === -1) nextTokenSeparatorIndex = tempText.indexOf(' #');
      if(nextTokenSeparatorIndex === -1) {
        // No separator found, this is the last footer
        footer.token = footerToken;
        footer.value = tempText;
        tempText = '';
        
        if(options.trimFooterValue) {
          footer.value = footer.value.trim();
        }
        
        result.footers.push(footer);
        console.debug('Footer:', footer);
      } else {
        // Separator found so continue with separating next footer's token from this footer's value...

        // A footer’s value MAY contain spaces and newlines, and parsing MUST terminate when the next
        // valid footer token/separator pair is observed.
        const currentValueAndNextTokenText = tempText.substring(0, nextTokenSeparatorIndex);
        
        // We now have footer value WITH token of next footer. We need to extract the token of next footer
        const extractNextToken = /[\w-]+$/igu;
        console.debug('Trying to extract token from:', currentValueAndNextTokenText);
        const matched = extractNextToken.exec(currentValueAndNextTokenText);
        if(!matched) {
          console.debug(`Couldn't parse token of next footer to determine where current footer value ends and next footer's token starts. footerValue: "${typeof currentValueAndNextTokenText === 'string' ? currentValueAndNextTokenText : typeof currentValueAndNextTokenText}"`);
          console.changeIndent(-1);
          return {
            ...{valid: false},
            ...(options.includeReasonWhyNotValid)
              ? {reason: `Couldn't parse token of next footer to determine where current footer value ends and next footer's token starts. footerValue: "${typeof currentValueAndNextTokenText === 'string' ? currentValueAndNextTokenText : typeof currentValueAndNextTokenText}"`}
              : {}
          };
        }
        footer.value = currentValueAndNextTokenText.substring(0, matched.index);
        tempText = tempText.substring(matched.index);
        footer.token = footerToken;
        
        if(options.trimFooterValue) {
          footer.value = footer.value.trim();
        }

        result.footers.push(footer);
        console.debug('footer:', footer);
      }
      
      // Breaking changes MUST be indicated in the type/scope prefix of a commit, or as an entry in the footer.
      
      // If included as a footer, a breaking change MUST consist of the uppercase text BREAKING CHANGE,
      // followed by a colon, space, and description, e.g.,
      // BREAKING CHANGE: environment variables now take precedence over config files.
      // BREAKING-CHANGE MUST be synonymous with BREAKING CHANGE, when used as a token in a footer.
      // The units of information that make up Conventional Commits MUST NOT be treated as case
      // sensitive by implementors, with the exception of BREAKING CHANGE which MUST be uppercase.
    
    } while(tempText.length);
    
    console.changeIndent(-1);
    return result;
  }
}

const gitLogCmd = new GitLogCommand();

gitLogCmd.addOption('name-only');
gitLogCmd.addOption('--max-count', 100);

gitLogCmd.include(GitCommitData.HASH);
gitLogCmd.include(GitCommitData.TAG);
gitLogCmd.include(GitCommitData.AUTHOR_NAME);
gitLogCmd.include(GitCommitData.AUTHOR_EMAIL);
gitLogCmd.include(GitCommitData.AUTHOR_TIME);
gitLogCmd.include(GitCommitData.COMMITTER_NAME);
gitLogCmd.include(GitCommitData.COMMITTER_EMAIL);
gitLogCmd.include(GitCommitData.COMMITTER_TIME);
gitLogCmd.include(GitCommitData.SUBJECT);
gitLogCmd.include(GitCommitData.RAW_BODY);

const commits = await gitLogCmd.run();
const data = [];
for(const commit of commits) {
  const dataItem = { commit: commit };
  data.push(dataItem);

  dataItem.packagesInvolved = getPackagesInvolved(dataItem.commit);
  dataItem.conventionalCommit = ConventionalCommitParser.parseGitLogCommitData(dataItem.commit);

  console.debug('dataItem', dataItem);
}

console.log('data:', data);
