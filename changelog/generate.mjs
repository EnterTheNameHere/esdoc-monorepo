import fse from 'fs-extra';
import upath from 'upath';
import globby from 'globby';

import { log } from './eslog.mjs';
import { GitLogCommand } from './GitLogCommand.mjs';
import { GitRemoteShowCommand } from './GitRemoteShowCommand.mjs';
import { ConventionalCommitParser } from './ConventionalCommitParser.mjs';
import { GitCommitLog } from './GitCommitLog.mjs';

import ansiColors from 'ansi-colors';

log.options.firstArgumentAsSectionMember = true;
log.showOnlyFromLevel(log.silly);

const config = {
  debug: true,
  verbose: true,
};

if(config.debug) {
  log.enable();
} else {
  log.disable();
}

log.debug('GenerateGitChangelog', 'Trying to read workspaces from package.json...');
const packageJSON = fse.readJsonSync('./package.json', {throws: false});
let workspaces = ['packages/*'];
if(packageJSON && Array.isArray(packageJSON.workspaces)) {
  log.debug('GenerateGitChangelog', 'Workspaces loaded:', packageJSON.workspaces);
  workspaces = packageJSON.workspaces;
}

log.debug('GenerateGitChangelog', 'Trying to find packages in workspaces...');
const workspacePackageJSONPaths = [];
const workspacePackageJSONFiles = new Map();
for(const workspace of workspaces) {
  // Add package.json to workspace path and see what we get...
  const packageJSONFilePattern = upath.normalizeSafe(upath.join(workspace, 'package.json'));
  
  workspacePackageJSONPaths.push(...globby.sync(packageJSONFilePattern));
}

const existingPackagesDirs = workspacePackageJSONPaths.map((packageJSONFilePath) => {
  const path = packageJSONFilePath.substring(0, packageJSONFilePath.length - 12);
  workspacePackageJSONFiles.set(path, fse.readJsonSync(packageJSONFilePath));
  return path;
});

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
function getPackagesInvolved(gitCommitLog) {
  if(typeof gitCommitLog.additionalData === 'string') {
    /**
     * @param {string} fileNamePath
     * @return {string|null}
     */
    const findNameOfPackageFileBelongsTo = (fileNamePath) => {
      for(const packageDir of existingPackagesDirs) {
        if(fileNamePath.startsWith(packageDir)) {
          return packageDir;
        }
      }
      return null;
    };
    
    const packagesInvolved = new Set();
    
    const additionalDataLines = gitCommitLog.additionalData.split('\n');
    for(const additionalDataLine of additionalDataLines) {
      const packageName = findNameOfPackageFileBelongsTo(additionalDataLine);
      if(typeof packageName === 'string' && packageName.trim() !== '') {
        packagesInvolved.add(packageName);
      }  
    }
    
    if(packagesInvolved.size === 0) {
      return null;
    }
    return Array.from(packagesInvolved);
  }
  
  return null;
}

const changelogFiles = new Map();
function generateChangelogs(data) {
  const lLog = log.withSection('generateChangelogs');
  if(!data) return;
  
  for(const dataItem of data) {
    if(!dataItem.packagesInvolved) continue;
    for(const packageName of dataItem.packagesInvolved) {
      lLog.debug('fixedWorkspacesPaths', '', workspacePackageJSONPaths);
      for(const fixedWorkspacePath of workspacePackageJSONPaths) {
        lLog.debug('fixedWorkspacePath', '', fixedWorkspacePath);
        const changelogDirectory = upath.joinSafe(fixedWorkspacePath, packageName);
        const changelogFilePath = upath.joinSafe(changelogDirectory, 'CHANGELOG.md');
        
        let changelogFileEntry = null;
        
        // Check file entry exists before trying to access filesystem
        if(changelogFiles.has(changelogFilePath)) {
          changelogFileEntry = changelogFiles.get(changelogFilePath);
        }
        
        if(!changelogFileEntry) {
          if(fse.existsSync(changelogDirectory)) {
            lLog.debug('generateChangelogs', 'Checking if following directory exists:', changelogDirectory);
            lLog.debug('generateChangelogs', 'Exists...');
            if(!changelogFiles.has(changelogFilePath)) {
              changelogFiles.set(changelogFilePath, { lastTag: '', contents: '' });
            }
            changelogFileEntry = changelogFiles.get(changelogFilePath);
          } else {
            lLog.debug('generateChangelogs', 'Does not exist...');
          }
        }
        
        if(changelogFileEntry) {
          let text = '';
          if(changelogFileEntry.lastTag !== dataItem.commit.tag) {
            changelogFileEntry.lastTag = dataItem.commit.tag;
            
            text += `\n## ${String(dataItem.commit.tag)}\n\n`;
          }
          
          if(dataItem.conventionalCommit && dataItem.conventionalCommit.valid === true) {
            text += '- ';
            text += `[${dataItem.commit.hash.substring(0,4)}](${dataItem.commit.hash}) `;
            text += String(dataItem.conventionalCommit.type);
            text += dataItem.conventionalCommit.scope ? `(${String(dataItem.conventionalCommit.scope)}): ` : ': ';
            text += String(dataItem.conventionalCommit.description);
            text += '\n';
          } else {
            text += '- ';
            text += `[${dataItem.commit.hash.substring(0,4)}](${dataItem.commit.hash}) `;
            text += String(dataItem.commit.subject);
            text += '\n';
          }
          
          changelogFileEntry.contents += text;
        }
      }
    }
  }

  for(const changelogFilePath of changelogFiles.keys()) {
    lLog.debug('generateChangelogs', 'About to write changelog into:', changelogFilePath);

    const changelogFileEntry = changelogFiles.get(changelogFilePath);
    changelogFileEntry.contents = `# CHANGELOG\n${changelogFileEntry.contents}`;
    
    fse.writeFileSync(changelogFilePath, changelogFileEntry.contents);
  }
}

const gitRemotes = await GitRemoteShowCommand.getGitRemotes();

let gitUrl = null;
if(gitRemotes && gitRemotes[0] && gitRemotes[0].url) {
  gitUrl = gitRemotes[0].url;
}

const gitLogCmd = new GitLogCommand(config);

gitLogCmd.addOption('name-only');
gitLogCmd.addOption('--max-count', 20);

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
  const gitCommitLog = GitCommitLog.create(commit);
  gitCommitLog.packagesInvolved = getPackagesInvolved(commit);
  if(gitUrl) {
    if(!gitCommitLog.repository) {
      gitCommitLog.repository = {
        type: 'git',
        url: gitUrl,
      };
    }
  }
  gitCommitLog.conventionalCommit = ConventionalCommitParser.parseGitLogCommitData(commit);
  gitCommitLog.normalize();
}

generateChangelogs(data);
