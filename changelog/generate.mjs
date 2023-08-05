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
    
    const result = await helperRunCommand(command);

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

function getConventionalCommitData(commit) {
  const conventionalCommitData = {
    type: '',
    scope: '',
    description: '',
    body: '',
    footer: ''
  };

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
}

console.log('commits:', commits);

// const startTag = '@start@';
// const endTag = '@end@';
// const sepTag = '@sep@';
// /// @type {[{argument: string, name: string, group?: string} | {option: string, name?: string, value?: object}]}
// const data = [
//   { argument: '%H', name: 'hash' },
//   { argument: '%(describe:abbrev=0)', name: 'tag' },
//   { argument: '%at', group: 'user', name: 'time' },
//   { argument: '%an', group: 'user', name: 'name' },
//   { argument: '%ae', group: 'user', name: 'email' },
//   { argument: '%ct', group: 'committer', name: 'time' },
//   { argument: '%cn', group: 'committer', name: 'name' },
//   { argument: '%ce', group: 'committer', name: 'email' },
//   { argument: '%s', name: 'subject' },
//   { argument: '%B', name: 'rawBody' },
//   { option: '--name-only', name: 'file' },
//   { option: '--max-count', value: 100 }
// ];

// const command = gitLogCmd.constructGitLogCommand();
// const result = await helperRunCommand(command);

// console.log('result:', inspect(result, false, 10, true));

// if(result.error) {
//   console.error(ansiColor.red(result.error));
// }
// if(result.std.err.length) {
//   console.error(ansiColor.red(result.std.err.length));
// }

// const commits = [];

// if(result.std.out.length) {
//   /// @type {string[]}
//   const multipleLogs = result.std.out;
//   for(const singleLog of multipleLogs) {
//     let text = singleLog.trim();
//     console.log('text:\n%O', text);
//     const numberOfStartTags = (text.match(new RegExp(startTag, 'gu')) || []).length;
//     const numberOfEndTags = (text.match(new RegExp(endTag, 'gu')) || []).length;
    
//     // Properly formatted log will start with startTag, end with endTag, (optionally followed by file list)
//     // and there will be just 1 tag of each
//     if(numberOfStartTags === 1 && numberOfEndTags === 1) {
//       const commit = {};

//       // Separate log into individual items
//       const separated = text.split(sepTag);
      
//       // Remove startTag
//       let item = separated[0];
//       item = item.replace(startTag, '');
//       separated[0] = item;

//       // After endTag we might have a list of files
//       item = separated[separated.length-1];
//       if(!item.endsWith(endTag)) {
//         // We have list of files, so extract them...
//         const halves = item.split(endTag);

//         // Get just the raw body part without files list
//         item = halves[0];
        
//         // TODO: extract package names
//         const files = halves[1].split('\n');
//         commit.files = [];
//         commit.packagesInvolved = new Set();
//         for(const file of files) {
//           if(file.trim().length) {
//             const filePathParts = file.split('/');
//             if(filePathParts[0] === 'packages') {
//               commit.packagesInvolved.add(filePathParts[1] ?? '');
//             }
//             commit.files.push(file.trim());
//           }
//         }
//         commit.packagesInvolved = Array.from(commit.packagesInvolved);
//       }
//       item = item.replace(endTag, '');
//       separated[separated.length-1] = item;
      
//       // commit
//       commit.hash = separated[0];

//       // tag
//       commit.tag = separated[1];
      
//       // author
//       commit.author = {
//         name: separated[3],
//         email: separated[4],
//         time: separated[2],
//       };
      
//       // committer
//       commit.committer = {
//         name: separated[6],
//         email: separated[7],
//         time: separated[5],
//       };
      
//       // subject
//       commit.subject = separated[8];

//       // body
//       commit.body = separated[9];

//       commit.unprocessed = separated;

//       commits.push(commit);
//     }
//   }
// }

// console.log(inspect(commits, false, 10, true));
