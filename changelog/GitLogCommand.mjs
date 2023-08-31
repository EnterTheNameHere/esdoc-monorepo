import { logDebug, logError, helperRunCommand } from './utils.mjs';

/**
 * Executes `log` command to `git` with custom pretty print format to request data from commit.
 * Additional data can be requested, which will be appended after pretty print part. This
 * additional data is provided as is, no separation or parsing is performed on it...
 */
export class GitLogCommand {
  /**
   * @protected
   * Options used when user doesn't provide any further options.
   */
  static defaultOptions = {
    debug: true,
    verbose: true,
  };
  
  /**
   * @protected
   * Separator used to determine where data returned by pretty print starts.
   */
  prettyFormatStartTag = '@start@';
  /**
   * @protected
   * Separator used to determine where data returned by pretty print ends.
   */
  prettyFormatEndTag = '@end@';
  /**
   * @protected
   * Separator used to split what pretty print returns to individual items.
   */
  prettyFormatSeparatorTag = '@sep@';
  
  data = [];
  dataOrder = [];  
  
  /**
   * Creates new instance of GitLogCommand with optional `options`.
   * Default options are used. If you want to provide your own value,
   * override the default value by providing `options` object.
   * @example
   * include { GitLogCommand } from './GitLogCommand.mjs';
   * 
   * const gitLogCmd = new GitLogCommand({ debug: true, verbose: true });
   * // gitLogCmd will now print debug and info messages
   * 
   * @param {instanceof(GitLogCommand.defaultOption)} options 
   */
  constructor(options = GitLogCommand.defaultOptions) {
    /**
     * @protected
     * Holds current options.
     */
    this.options = { ...GitLogCommand.defaultOptions, ...options };
  }
  
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
    const debug = this.options.debug ? logDebug : () => {};
    debug('GitLogCommand#addOption', name, value);

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
    const debug = this.options.debug ? logDebug : () => {};
    debug('GitLogCommand#include', '', data);

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
    const debug = this.options.debug ? logDebug : () => {};
    debug('GitLogCommand#runGitLogCommand', 'About to execute:', command);
    
    const result = await helperRunCommand(command);
    return result;
  }
  
  /**
   * 
   * @param {Array<string>} stdOut 
   */
  prepareRawStdOutToCommitsText(stdOut) {
    if(!Array.isArray(stdOut)) return [];
    
    const newLineSeparatedTexts = [];
    // Iterate over all outputs git log produced
    // Commit data can be just one entry, or take multiple entries. Entry with just a newline
    // functions as a divider between data of individual commits.
    let currentCommitText = '';
    for(const entry of stdOut) {
      if(entry !== '\n') {
        currentCommitText += entry;
      } else {
        newLineSeparatedTexts.push(currentCommitText);
        currentCommitText = '';
      }
    }
    
    const startTagSeparatedTexts = [];
    for(const entry of newLineSeparatedTexts) {
      const matched = entry.match(new RegExp(this.prettyFormatStartTag, 'gu'));
      if(matched.length > 1) {
        const splitted = entry.split(this.prettyFormatStartTag);
        for(const splittedEntry of splitted) {
          // Splitting leaves one empty entry, ignore it
          if(splittedEntry === '') continue;
          startTagSeparatedTexts.push(this.prettyFormatStartTag + splittedEntry);
        }
      } else {
        startTagSeparatedTexts.push(entry);
      }
    }
    
    return startTagSeparatedTexts;
  }
  

  processResultToCommits(result) {
    if(!result) throw new TypeError('Argument expected.');
    
    const debug = this.options.debug ? logDebug : () => {};
    
    // Git log output might not be nicely separated into individual entries.
    // Make sure we have them nicely separated before we iterate over them...
    const rawGitLogOutputs = this.prepareRawStdOutToCommitsText(result.std.out);
    const commits = [];
    
    for(const singleOutput of rawGitLogOutputs) {
      // Single log should be a string like this:
      // startTag
      // followed by commit data separated by separatorTag
      // endTag
      // optional additional output generated by using options line --name-only

      // startTag and endTag should exist only once in the whole single log string
      // We can use it to perform minimal safety check about data validity
      if(!singleOutput.startsWith(this.prettyFormatStartTag)) {
        debug('GitLogCommand#processResultToCommits', 'singleOutput', singleOutput);
        throw new Error("Data integrity error: commit data should start with startTag! Continuing could end in unexpected consequences so we're bailing...");
      }
      if((singleOutput.match(new RegExp(this.prettyFormatStartTag, 'gu')) || []).length !== 1) {
        debug('GitLogCommand#processResultToCommits', 'singleOutput', singleOutput);
        throw new Error("Data integrity error: only one startTag is expected to exist in commit data, but more or none found! Continuing could end in unexpected consequences so we're bailing...");
      }
      if((singleOutput.match(new RegExp(this.prettyFormatEndTag, 'gu')) || []).length !== 1) {
        debug('GitLogCommand#processResultToCommits', 'singleOutput', singleOutput);
        throw new Error("Data integrity error: only one endTag is expected to exist in commit data, but more or none found! Continuing could end in unexpected consequences so we're bailing...");
      }
      
      // Let's split what we got by endTag, so we have commit data and optional additional option data separated
      const split = singleOutput.split(this.prettyFormatEndTag);
      let commitText = split[0] ?? 'error';
      const additionalText = split[1] ?? '';
      
      if(commitText === 'error') {
        debug('GitLogCommand#processResultToCommits', 'singleOutput', singleOutput);
        debug('GitLogCommand#processResultToCommits', 'split', split);
        throw new Error("Data integrity error: after separating commit data from possible additional data somehow ended in error! Continuing could end in unexpected consequences so we're bailing...");
      }
      
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
    
    return commits;
  }
  
  async run() {
    const result = await this.runGitLogCommand();
    
    // Report errors we received
    if(result.error) {
      logError('GitLogCommand#run', result.error);
    }
    if(result.std.err.length) {
      logError('GitLogCommand#run', result.std.err.length);
    }
  
    // Process what we got to commit objects and return them to user...
    const commits = this.processResultToCommits(result);
    return commits;
  }
}
