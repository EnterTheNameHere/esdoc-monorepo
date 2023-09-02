import { log } from './eslog.mjs';
import { helperRunCommand } from './utils.mjs';

/**
 * Used to get git remotes list to populate GitCommitLog repository field.
 */

export class GitRemoteShowCommand
{
  /**
   * @type {boolean} defaults to true
   *
   * If *true*, it will tell git not to query remote heads but use cache.
   *
   * @public
   */
  static useCache = true;

  /**
   * Returns array of objects with list of remotes received from git remote --verbose show, or *null*
   * when error or invalid output is encountered.
   *
   * @returns {Array<{name: string, url: string, type: string}>|null}
   */
  static async getGitRemotes()
  {
    const result = await this.#run();

    /**
     * @type {Array<Array<string>>}
     */
    const stdOut = result.std.out;

    if (stdOut.length === 0) {
      return null;
    }

    /**
     * @type {Array<{name: string, url: string, type: string}>}
     */
    const remotes = new Set();

    // TODO: fix it?, see run()
    /**
     * @type {Array<string>}
     */
    const lines = stdOut[0].split('\n');
    for (const line of lines) {
      if (line === '') continue;

      // example line:
      // origin\thttps://github.com/enterthenamehere/esdoc-monorepo.git (fetch)
      const splitLine = line.split('\t');
      if (splitLine.length !== 2) {
        log.error('GitRemoteShow#getGitRemotes', 'Running git remote command produced unexpected output. Remotes list unavailable.', stdOut);
        return null;
      }

      const splitURLAndType = splitLine[1].split(' ');
      if (splitURLAndType.length !== 2) {
        log.error('GitRemoteShow#getGitRemotes', 'Running git remote command produced unexpected output. Remotes list unavailable.', stdOut);
        return null;
      }

      /**
       * @type {name: string, url: string, type: string}
       */
      const remote = {
        name: splitLine[0],
        url: splitURLAndType[0],
        type: splitURLAndType[1].substring(1, splitURLAndType[1].length - 1),
      };

      remotes.add(remote);
    }

    return Array.from(remotes);
  }

  static async #run()
  {
    const result = await helperRunCommand(`git remote --verbose show${this.useCache ? ' -n' : ''}`);

    // TODO: We should perform check if stdOut array string entries are complete and not split mid output
    // example:
    // [
    //   'line 1\n',
    //   'multiline 1' +
    //   'this is continuation of multiline 1\n',
    //   'multiline 1 was ended with \n',
    //   'which makes it valid end...\n',
    //   'but this multiline 2 is' +
    //   'ended prema',
    //   'turely, notice no \n before the , there\n',
    //   'that means splitting by \n',
    //   'will not work as expected...\n',
    //   'and we should fix this before giving it as complete...\n',
    //   'more testing with multiple \n in output is needed to make it fail proof...\n',
    // ]
    // Report errors we received
    if (result.error) {
      log.error('GitRemoteShow', result.error);
    }
    if (result.std.err.length) {
      log.error('GitRemoteShow', result.std.err);
    }

    return result;
  }
}
