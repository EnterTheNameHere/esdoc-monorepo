import { logDebug } from './utils.mjs';
import { GitLogCommand } from './GitLogCommand.mjs';
import { ConventionalCommitParser } from './ConventionalCommitParser.mjs';

const config = {
  debug: false,
  verbose: false,
};
const debug = config.debug ? logDebug : () => {};

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



const gitLogCmd = new GitLogCommand(config);

gitLogCmd.addOption('name-only');
gitLogCmd.addOption('--max-count', 30);

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
  dataItem.conventionalCommit = ConventionalCommitParser.parseGitLogCommitData(dataItem.commit, config);
  
  debug('GenerateGitChangelog', 'dataItem', dataItem);
}

debug('GenerateGitChangelog', 'data:', data);
