import { exec } from 'node:child_process';
import { inspect } from 'node:util';
import ansiColor from 'ansi-colors';

const origDebug = console.debug;
console.debug = function (message, ...args) {
  origDebug(ansiColor.cyan('[DEBUG] ') + message, args.map( (arg) => { return inspect(arg, false, 10, true); }).join(' ') );
};

// eslint-disable-next-line no-console
const origLog = console.log;
// eslint-disable-next-line no-console
console.log = function (message, ...args) {
  origLog(ansiColor.yellow('[  LOG] ') + message, args.map( (arg) => { return inspect(arg, false, 10, true); }).join(' ') );
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
        this.dataOrder.push({index: prettyFormatPlaceholders.length - 1, placeholder: entry});
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
  
  addFormatPlaceholder(placeholder, customPropertyName, customPropertyGroup = null) {
    // Validate placeholder, for example %an, which requests author's name
    if(typeof placeholder !== 'string') throw new TypeError('A string indicating format placeholder is expected!');
    if(placeholder.trim().length === 0) throw new Error('Placeholder cannot be empty!');
    // Validate property name under which we will store the data we got for this placeholder, for example 'name', like { name: 'Ben' }
    if(typeof customPropertyName !== 'string') throw new TypeError(`A string specifying a name in property under which you would like to store this placeholder "${placeholder}"'s data under is expected!`);
    // TODO: Make property name safe
    if(customPropertyName.trim().length === 0) throw new Error(`Name of property under which you would like to store this placeholder "${placeholder}"'s data under cannot be empty!`);
    // If exists, validate group property name under which we store the data we got for this placeholder, for example with group name 'author' and property's name 'name', it will be { author: { name: 'Ben' } }
    if(customPropertyGroup !== null) {
      // TODO: group Make property name safe
      if(typeof customPropertyGroup !== 'string') throw new TypeError(`A string specifying a group property name under which you want "${placeholder}"'s data to be stored under is expected!`);
      if(customPropertyGroup.trim().length === 0) throw new Error(`Group name under which you would like to store this placeholder "${placeholder}"'s data under cannot be empty!`);
    }
    
    const entry = {};
    entry.placeholder = placeholder;
    entry.name = customPropertyName;
    if(customPropertyGroup) {
      entry.group = customPropertyGroup;
    }
    
    this.data.push(entry);
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
      'Signed-off-by: dependabot[bot] <support@github.com>\n' +
      'Approved-by: dependabot[bot] <support@github.com>\n' +
      'Read-by: dependabot[bot] <support@github.com>\n' +
      'Written-by: dependabot[bot] <support@github.com>\n' +
      'Bored-by: dependabot[bot] <support@github.com>@end@\n' +
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
          const groupPropertyName = entry.placeholder.group;
          const propertyName = entry.placeholder.name;
          const propertyValue = commitData[entry.index];
          
          // If groupPropertyName is set, propertyValue should be stored under another property named groupPropertyName,
          // eg. { groupPropertyName: { propertyName: propertyValue } }
          if(groupPropertyName) {
            // Make sure the property with groupPropertyName exists in root
            if(!commit[groupPropertyName]) commit[groupPropertyName] = {};
            // Store the value under the groupPropertyName property
            commit[groupPropertyName][propertyName] = propertyValue;
          } else {
            // Store the propertyValue in root
            commit[propertyName] = propertyValue;
          }
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

/**
 * Parse commit's raw body as conventional commit. If commit raw body doesn't conform to conventional
 * commit's specification, property named 'valid' in returned object will be set to **false**. Parsing in
 * such case was aborted and any data in returned object should be ignored.
 * 
 * @example
 * const commit = {
 *   rawBody: 'fix(parser): detection of separator'
 * }
 * const conventionalCommit = getConventionalCommitData(commit);
 * if(conventionalCommit.valid) {
 *   console.log(conventionalCommit.type)        // "fix"
 *   console.log(conventionalCommit.scope)       // "parser"
 *   console.log(conventionalCommit.description) // "detection of separator"
 * }
 * 
 * @param {*} commit 
 * @returns 
 */
function getConventionalCommitData(commit) {
  // If we find commit body cannot be parsed as a conventional commit, set valid to false and return immediately...
  const conventionalCommitData = {
    type: '',
    scope: '',
    description: '',
    rawBody: '',
    bodies: [],
    rawFooter: '',
    footers: [],
    valid: true,
    breakingChange: false,
  };
  
  /** @type {string} */
  let body = commit.rawBody;
  
  // This is highly unexpected, maybe TODO: report something?
  if(!body) {
    conventionalCommitData.valid = false;
    return conventionalCommitData;
  }
  
  // Now let's try parsing commit body message according to conventional commit specification:

  // Commits MUST be prefixed with a type, which consists of a noun, feat, fix, etc.,
  // followed by the OPTIONAL scope, OPTIONAL !, and REQUIRED terminal colon and space.
  let index = body.indexOf(': ');
  if(index === -1) {
    conventionalCommitData.valid = false;
    return conventionalCommitData;
  }
  conventionalCommitData.type = body.substring(0, index);
  body = body.substring(index+2);
  
  // The type feat MUST be used when a commit adds a new feature to your application or library.

  // The type fix MUST be used when a commit represents a bug fix for your application.
  
  // A scope MAY be provided after a type. A scope MUST consist of a noun describing
  // a section of the codebase surrounded by parenthesis, e.g., fix(parser):
  index = conventionalCommitData.type.indexOf('(');
  let indexStart = index;
  // We imply there should be only one ( so if more are found, it's not valid conventional commit
  let secondParenIndex = conventionalCommitData.type.indexOf('(', indexStart+1);
  if(secondParenIndex !== -1) {
    conventionalCommitData.valid = false;
    return conventionalCommitData;
  }
  let indexEnd = conventionalCommitData.type.indexOf(')');
  if(indexStart !== -1 && indexEnd !== -1) {
    const tempText = conventionalCommitData.type;
    conventionalCommitData.type = tempText.substring(0, indexStart);
    conventionalCommitData.scope = tempText.substring(indexStart+1, indexEnd);

    // If included in the type/scope prefix, breaking changes MUST be indicated by a ! immediately
    // before the :. If ! is used, BREAKING CHANGE: MAY be omitted from the footer section, and the
    // commit description SHALL be used to describe the breaking change.

    // Check for ! aka BREAKING CHANGE
    if(tempText.endsWith('!')) {
      conventionalCommitData.breakingChange = true;
    }
  }
  
  // If included in the type/scope prefix, breaking changes MUST be indicated by a ! immediately
  // before the :. If ! is used, BREAKING CHANGE: MAY be omitted from the footer section, and the
  // commit description SHALL be used to describe the breaking change.

  // Check for ! aka BREAKING CHANGE
  if(conventionalCommitData.type.endsWith('!')) {
    conventionalCommitData.breakingChange = true;
  }
  
  // A description MUST immediately follow the colon and space after the type/scope prefix.
  // The description is a short summary of the code changes, e.g.,
  // fix: array parsing issue when multiple spaces were contained in string.
  
  // A longer commit body MAY be provided after the short description, providing additional
  // contextual information about the code changes. The body MUST begin one blank line after
  // the description.
  index = body.indexOf('\n\n');
  
  if(index !== -1) {
    conventionalCommitData.description = body.substring(0, index);
    body = body.substring(index+2);
  } else {
    // No empty line was found, so all we have is description and we are done...
    conventionalCommitData.description = body;
    return conventionalCommitData;
  }
  
  // A commit body is free-form and MAY consist of any number of newline separated paragraphs.

  // One or more footers MAY be provided one blank line after the body. (...)
  index = body.lastIndexOf('\n\n');
  if(index === -1) {
    // No footer found
    conventionalCommitData.rawBody = body;
    return conventionalCommitData;
  }

  // Footer found
  conventionalCommitData.rawBody = body.substring(0, index);
  body = body.substring(index+2);
  conventionalCommitData.rawFooter = body;
  
  // (...) Each footer MUST consist of a word token, followed by either a :<space> or <space># separator,
  // followed by a string value (this is inspired by the git trailer convention).
  do {
    // Footer message MUST contain token separator, otherwise it's not a valid conventional commit
    let currentFooterTokenSeparatorIndex = body.indexOf(': ');
    if(currentFooterTokenSeparatorIndex === -1) currentFooterTokenSeparatorIndex = body.indexOf(' #');
    if(currentFooterTokenSeparatorIndex === -1) {
      conventionalCommitData.valid = false;
      return conventionalCommitData;
    }

    // Check if this is final footer
    let nextFooterTokenSeparatorIndex = body.indexOf(': ', currentFooterTokenSeparatorIndex+1);
    if(nextFooterTokenSeparatorIndex === -1) nextFooterTokenSeparatorIndex = body.indexOf(' #', currentFooterTokenSeparatorIndex+1);
    if(nextFooterTokenSeparatorIndex === -1) {
      // Footer is final one
      conventionalCommitData.footers.push(body.trim());
      return conventionalCommitData;
    }
    
    // More footers exists, extract current one (together with token of next footer)
    let currentFooter = body.substring(0, nextFooterTokenSeparatorIndex);
    
    // A footer’s token MUST use - in place of whitespace characters,
    // e.g., Acked-by (this helps differentiate the footer section from a 
    // multi-paragraph body). An exception is made for BREAKING CHANGE,
    // which MAY also be used as a token.

    // A footer’s value MAY contain spaces and newlines, and parsing MUST terminate when the next
    // valid footer token/separator pair is observed.
    
    // We backtrack from the next footer's separator's position to start of it's token to get end of current footer
    const matched = currentFooter.match(/.*$/u);
    const token = matched[0];
    // Remove the token, getting just current footer
    currentFooter = currentFooter.substring(0, currentFooter.length - token.length);
    // Save current token
    conventionalCommitData.footers.push(currentFooter.trim());
    // And to next footer
    body = body.substring(currentFooter.length);
    
  } while (body.length);
  
  // Breaking changes MUST be indicated in the type/scope prefix of a commit, or as an entry in the footer.
  
  // If included as a footer, a breaking change MUST consist of the uppercase text BREAKING CHANGE,
  // followed by a colon, space, and description, e.g.,
  // BREAKING CHANGE: environment variables now take precedence over config files.
  
  // BREAKING-CHANGE MUST be synonymous with BREAKING CHANGE, when used as a token in a footer.
  
  // The units of information that make up Conventional Commits MUST NOT be treated as case
  // sensitive by implementors, with the exception of BREAKING CHANGE which MUST be uppercase.
  
  for(const footer of conventionalCommitData.footers) {
    console.log('footer', footer);
    if(footer.startsWith('BREAKING CHANGE: ') || footer.startsWith('BREAKING-CHANGE: ')) {
      conventionalCommitData.breakingChange = true;
      break;
    }
  }
  
  // Types other than feat and fix MAY be used in your commit messages, e.g., docs: update ref docs.
  

  return conventionalCommitData;
}

const gitLogCmd = new GitLogCommand();

gitLogCmd.addOption('name-only');
gitLogCmd.addOption('--max-count', 100);

gitLogCmd.addFormatPlaceholder('%H', 'hash');
gitLogCmd.addFormatPlaceholder('%(describe:abbrev=0)', 'tag');
gitLogCmd.addFormatPlaceholder('%an', 'name', 'author');
gitLogCmd.addFormatPlaceholder('%ae', 'email', 'author');
gitLogCmd.addFormatPlaceholder('%at', 'time', 'author');
gitLogCmd.addFormatPlaceholder('%cn', 'name', 'committer');
gitLogCmd.addFormatPlaceholder('%ce', 'email', 'committer');
gitLogCmd.addFormatPlaceholder('%ct', 'time', 'committer');
gitLogCmd.addFormatPlaceholder('%s', 'subject');
gitLogCmd.addFormatPlaceholder('%B', 'rawBody');

gitLogCmd.run();

const commits = await gitLogCmd.run();
for(const commit of commits) {
  commit.packagesInvolved = getPackagesInvolved(commit);
  commit.conventionalCommit = getConventionalCommitData(commit);
}

console.log('commits:', commits);
