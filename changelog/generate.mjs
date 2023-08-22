import { inspect } from 'node:util';
import ansiColor from 'ansi-colors';

import { GitLogCommand } from './GitLogCommand.mjs';
import { ConventionalCommitParser } from './ConventionalCommitParser.mjs';

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

console.log = origLog;
console.debug = origDebug;
