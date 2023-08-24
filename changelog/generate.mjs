import fse from 'fs-extra';
import upath from 'upath';

import { logDebug, logError } from './utils.mjs';
import { GitLogCommand } from './GitLogCommand.mjs';
import { ConventionalCommitParser } from './ConventionalCommitParser.mjs';

const config = {
  debug: true,
  verbose: false,
};
const debug = config.debug ? logDebug : () => {};



debug('GenerateGitChangelog', 'Trying to read workspaces from package.json...');
const packageJSON = fse.readJsonSync('./package.json', {throws: false});
let workspaces = ['packages/*'];
if(packageJSON && Array.isArray(packageJSON.workspaces)) {
  debug('GenerateGitChangelog', 'Workspaces loaded:', packageJSON.workspaces);
  workspaces = packageJSON.workspaces;
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


// TODO: Try inferring scope by using directories of files, eg.
// TODO: changelog/ConventionalCommitParser.mjs > no package, changelog
// TODO: packages/esdoc-publish-html-plugin/package.json > publish-html, no scope
// TODO: packages/esdoc-publish-html-plugin/src/Builder/DocBuilder.js > publish-html, builder
// TODO: .github/workflows/local-install-test-minimal.yml > no package, github-workflows
const fixedWorkspacesPaths = new Set();
function getPackagesInvolved(commit) {
  const packagesInvolved = new Set();
  
  for(const workspacePath of workspaces) {
    let fixedPath = workspacePath;
    while(fixedPath.endsWith('*') || fixedPath.endsWith('.')) {
      fixedPath = fixedPath.substring(0, fixedPath.length - 1);
    }
    // Data integrity check
    if(!fixedPath.endsWith('/')) {
      logError('getPackagesInvolved', 'Integrity check: Workspace path, after fixing, is expected to end with / character, but it doesn\'t!', fixedPath);
    }
    fixedWorkspacesPaths.add(fixedPath);
  }

  // Check if there is any data returned cause options were used
  if(commit.optionsData) {
    const lines = commit.optionsData.split('\n');
    
    for(const line of lines) {
      for(const path of fixedWorkspacesPaths) {
        // File paths are one per line, so if path starts with workspace path, we can get name of package involved
        if(line.startsWith(path)) {
          const filePathParts = line.split('/');
          const packageName = filePathParts[1] ?? '';
          if(packageName) packagesInvolved.add(packageName);
        }
      }
    }
  }
  
  return Array.from(packagesInvolved);
}


const FileMode = {
  createNewFile: 1,
  append: 2,
};

const FileOrder = {
  asc: 1,
  desc: 2,
};

const changelogFiles = new Map();
function generateChangelogs(data) {
  if(!data) return;
  
  for(const dataItem of data) {
    for(const packageName of dataItem.packagesInvolved) {
      debug('fixedWorkspacesPaths', '', fixedWorkspacesPaths);
      for(const fixedWorkspacePath of fixedWorkspacesPaths) {
        debug('fixedWorkspacePath', '', fixedWorkspacePath);
        const changelogDirectory = upath.joinSafe(fixedWorkspacePath, packageName);
        const changelogFilePath = upath.joinSafe(changelogDirectory, 'CHANGELOG.md');
        
        let changelogFileEntry = null;
        
        // Check file entry exists before trying to access filesystem
        if(changelogFiles.has(changelogFilePath)) {
          changelogFileEntry = changelogFiles.get(changelogFilePath);
        }
        
        if(!changelogFileEntry) {
          if(fse.existsSync(changelogDirectory)) {
            debug('generateChangelogs', 'Checking if following directory exists:', changelogDirectory);
            debug('generateChangelogs', 'Exists...');
            if(!changelogFiles.has(changelogFilePath)) {
              changelogFiles.set(changelogFilePath, { lastTag: '', contents: '' });
            }
            changelogFileEntry = changelogFiles.get(changelogFilePath);
          } else {
            debug('generateChangelogs', 'Does not exist...');
          }
        }

        if(changelogFileEntry) {
          let text = '';
          if(changelogFileEntry.lastTag !== dataItem.commit.tag) {
            changelogFileEntry.lastTag = dataItem.commit.tag;
            
            if(changelogFileEntry.contents.length !== 0) {
              text += '\n\n';
            }
            text += `# ${String(dataItem.commit.tag)}\n\n`;
          }
          
          if(dataItem.conventionalCommit && dataItem.conventionalCommit.valid === true) {
            text += '- ';
            text += String(dataItem.conventionalCommit.type);
            text += dataItem.conventionalCommit.scope ? `(${String(dataItem.conventionalCommit.scope)}): ` : ': ';
            text += String(dataItem.conventionalCommit.description);
            text += '\n';
          } else {
            text += String(dataItem.commit.subject);
          }
          
          changelogFileEntry.contents += text;
        }
      }
    }
  }

  for(const changelogFilePath of changelogFiles.keys()) {
    debug('generateChangelogs', 'About to write changelog into:', changelogFilePath);
    fse.writeFileSync(changelogFilePath, changelogFiles.get(changelogFilePath).contents);
  }
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
  
  debug('GenerateGitChangelog', 'dataItem after processing:', dataItem);
}

generateChangelogs(data);
