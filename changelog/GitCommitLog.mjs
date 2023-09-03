import { URL } from 'node:url';
import { log as parentLog } from './eslog.mjs';

const log = parentLog.withSection('GitCommitLog');

export class GitCommitLog
{
  constructor(argsPack = GitCommitLog.getEmptyGitCommitLog())
  {
    Object.assign(this, GitCommitLog.getEmptyGitCommitLog());
    Object.assign(this, argsPack);
  }
  
  static getEmptyGitCommitLog() {
    return {
      hash: null,
      gitLink: null,
      tag: null,
      subject: null,
      author: { name: null, email: null, time: null },
      committer: { name: null, email: null, time: null },
      repository: null,
      rawBody: null,
      additionalData: null,
      packagesInvolved: null,
      conventionalCommit: {
        type: null,
        scope: null,
        description: null,
        rawBody: null,
        body: null,
        rawFooter: null,
        footers: [],
        valid: false,
        breakingChange: false,
      }
    };
  }
  
  static create(argsPack)
  {
    return new GitCommitLog(argsPack);
  }

  normalize()
  {
    if (this.repository === null) {
      // No repository data is a valid value, ignore...
    } else if (typeof this.repository === 'object') {
      // { type: string, url: string, directory?: string }
      if (typeof this.repository.type === 'string' && this.repository.type === 'git') {
        if (typeof this.repository.url === 'string') {
          const parsedURL = new URL(this.repository.url);
          if (parsedURL.hostname === 'github.com' && parsedURL.pathname.endsWith('.git')) {
            // Github
            // https://github.com/EnterTheNameHere/esdoc-monorepo.git
            // https://github.com/EnterTheNameHere/esdoc-monorepo/commit/38ffc2725eaf89622baf52c57578448dd14e6499
            this.gitLink = `${parsedURL.protocol}//${parsedURL.hostname}${parsedURL.pathname.substring(0, parsedURL.pathname.length - 4)}/commit/${this.hash}`;
          }
        }
      } else {
        log.warning('normalize', 'Repository type is not git', this.repository);
      }
    } else if (typeof this.repository === 'string') {
      // TODO: "repository": "npm/npm"
      //       "repository": "github:user/repo"
      //       "repository": "gist:11081aaa281"
      //       "repository": "bitbucket:user/repo"
      //       "repository": "gitlab:user/repo"
    } else {
      log.warning('normalize', 'Unknown repository field', this.repository);
    }
  }
}
