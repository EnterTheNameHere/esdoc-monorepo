import { logDebug } from './utils.mjs';

export class ConventionalCommitParser {  
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
  
  /**
   * Tries parsing `{ rawBody: 'text here' }` given as an argument according to Conventional Commit specification.
   * The argument is expected to be a single commit data from commits data returned by {@see GitCommitData#run}.
   * 
   * Default options are used. If you want to provide your own value,
   * override the default value by providing `options` object.
   * @example
   * include { GitLogCommand } from './GitLogCommand.mjs';
   * 
   * const gitLogCmd = new GitLogCommand();
   * gitLogCmd.include({ name: 'hash', placeholder: '%H' });
   * gitLogCmd.include({ name: 'author.name', placeholder: '%an' });
   * gitLogCmd.addOption('--max-count', 1);
   * 
   * const commitsData = await gitLogCmd.run();
   * 
   * for(const commitData of commitsData) {
   *   const conventionalCommit = ConventionalCommitParser.parseGitLogCommitData(commitData, {debug: true, verbose: true});
   *   // ConventionalCommitParser will print debug and info messages
   *   console.log(conventionalCommit);
   *   // {
   *   //   valid: true,
   *   //   hash: "########################################",
   *   //   author: {
   *   //     name: "EnterTheNameHere Bohemian"
   *   //   }
   *   // }
   * }
   * 
   * @param {{ rawBody: string }} commitData 
   * @param {instanceof(ConventionalCommitParser.defaultOptions)} options 
   * @returns 
   */
  static parseGitLogCommitData(commitData, options = this.defaultOptions) {
    // Fill missing options in case user didn't provide them all
    const lOptions = { ...this.defaultOptions, ...options };
    
    const debug = lOptions.debug ? logDebug : () => {};
    
    if(!commitData.rawBody) {
      throw new TypeError('GitLogData.rawBody is required to parse conventional commit from it!');
    }
    if(typeof commitData.rawBody !== 'string') {
      throw new TypeError('GitLogData.rawBody must be a string!');
    }
    
    debug('ConventionalCommitParser#parseGitLogCommitData', 'Parsing git commit raw body:', commitData.rawBody);

    /**
     * @type {string}
     */
    const rawBodyText = commitData.rawBody;
    
    // Optional body can be provided after description, separated by a blank line from the header.
    let index = rawBodyText.indexOf('\n\n');
    let headerText = null;
    let bodyText = null;
    let footerText = null;
    debug('ConventionalCommitParser#parseGitLogCommitData', 'index of \\n\\n:', index);
    if(index !== -1) {
      // We have body
      headerText = rawBodyText.substring(0, index);
      bodyText = rawBodyText.substring(index+2);
      debug('ConventionalCommitParser#parseGitLogCommitData', 'headerText:', headerText);
      debug('ConventionalCommitParser#parseGitLogCommitData', 'bodyText:', bodyText);
      
      // Optional footer can be provided after body, separated by a blank line from the body.
      index = bodyText.lastIndexOf('\n\n');
      debug('ConventionalCommitParser#parseGitLogCommitData', 'index of last \\n\\n:', index);
      if(index !== -1) {
        footerText = bodyText.substring(index+2);
        bodyText = bodyText.substring(0, index);
        debug('ConventionalCommitParser#parseGitLogCommitData', 'footerText:', footerText);
        debug('ConventionalCommitParser#parseGitLogCommitData', 'bodyText:', bodyText);
      }
    } else {
      // No body, only header
      headerText = rawBodyText;
      debug('ConventionalCommitParser#parseGitLogCommitData', 'headerText:', headerText);
    }

    debug('ConventionalCommitParser#parseGitLogCommitData', 'headerText:', headerText);
    debug('ConventionalCommitParser#parseGitLogCommitData', 'bodyText:', bodyText);
    debug('ConventionalCommitParser#parseGitLogCommitData', 'footerText:', footerText);
    
    const header = headerText ? this.#parseHeader(headerText, lOptions) : { valid: true };
    debug('ConventionalCommitParser#parseGitLogCommitData', 'header:', header);
    if(!header.valid) {
      return header;
    }
    
    const footer = footerText ? this.#parseFooter(footerText, lOptions) : { valid: true };
    debug('ConventionalCommitParser#parseGitLogCommitData', 'footer:', footer);
    if(!footer.valid) {
      return footer;
    }
    
    const body = bodyText ? this.#parseBody(bodyText, lOptions) : { valid: true };
    debug('ConventionalCommitParser#parseGitLogCommitData', 'body:', body);
    if(!body.valid) {
      return body;
    }
    
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
    const debug = options.debug ? logDebug : () => {};

    debug('ConventionalCommitParser#parseHeader', 'Parsing ConventionalCommit header:', text);
    
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
      debug('ConventionalCommitParser#parseHeader', 'Separator not found.');
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
    debug('ConventionalCommitParser#parseHeader', 'tempText', tempText);
    result.description = text.substring(separatorIndex+2);
    if(options.trimDescription) {
      result.description = result.description.trim();
    }
    debug('ConventionalCommitParser#parseHeader', 'result.description', result.description);
    const parenStartIndex = tempText.indexOf('(');
    const parenEndIndex = tempText.indexOf(')', parenStartIndex+1);
    
    // Multiple ( would mean not valid scope
    let secondParenIndex = tempText.indexOf('(', parenStartIndex+1);
    if(secondParenIndex !== -1) {
      debug('ConventionalCommitParser#parseHeader', 'Multiple ( found.');
      return {
        ...{valid: false},
        ...(options?.includeReasonWhyNotValid ? {reason: 'Multiple ( found. Just one is expected.'} : {})
      };
    }
    // Multiple ) would mean not valid scope too
    secondParenIndex = tempText.indexOf(')', parenEndIndex+1);
    if(secondParenIndex !== -1) {
      debug('ConventionalCommitParser#parseHeader', 'Multiple ) found.');
      return {
        ...{valid: false},
        ...(options?.includeReasonWhyNotValid ? {reason: 'Multiple ) found. Just one is expected.'} : {})
      };
    }
    // Only ( without ) is not valid either
    if(parenStartIndex !== -1 && parenEndIndex === -1) {
      debug('ConventionalCommitParser#parseHeader', 'Only ( without pairing ending ) found.');
      return {
        ...{valid: false},
        ...(options?.includeReasonWhyNotValid ? {reason: 'Only ( without pairing ending ) found. That makes parens uneven.'} : {})
      };
    }
    // Only ) is not valid too
    if(parenStartIndex === -1 && parenEndIndex !== -1) {
      debug('ConventionalCommitParser#parseHeader', 'Only ) without pairing starting ( found.');
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
    debug('ConventionalCommitParser#parseHeader', 'result.breakingChange', result.breakingChange);
    
    debug('ConventionalCommitParser#parseHeader', 'result.scope', result.scope);
    
    result.type = tempText;
    
    debug('ConventionalCommitParser#parseHeader', 'result.type', result.type);

    // Now check if type and scope are single word
    const isAWord = /^\w+$/iu;
    if(!isAWord.test(result.type)) {
      debug('ConventionalCommitParser#parseHeader', `Parsed type is not a single word: "${result.type.length > 10 ? `${result.type.substring(0, 20)}...` : result.type}"`);
      return {
        ...{valid: false},
        ...(options?.includeReasonWhyNotValid)
          ? {reason: `Parsed type is not a single word: "${result.type.length > 10 ? `${result.type.substring(0, 20)}...` : result.type}"`}
          : {}
      };
    }
    
    if(typeof result.scope === 'string' && !isAWord.test(result.scope)) {
      debug('ConventionalCommitParser#parseHeader', `Parsed scope is not a single word: "${result.scope.length > 10 ? `${result.scope.substring(0, 20)}...` : result.scope}"`);
      return {
        ...{valid: false},
        ...(options?.includeReasonWhyNotValid)
          ? {reason: `Parsed scope is not a single word: "${result.scope.length > 10 ? `${result.scope.substring(0, 20)}...` : result.scope}"`}
          : {}
      };
    }
    
    return result;
  }
  
  /**
   * 
   * @param {string} text 
   * @param {*} options 
   */
  static #parseBody(text, options) {
    const debug = options.debug ? logDebug : () => {};

    debug('ConventionalCommitParser#parseBody', 'Parsing ConventionalCommit body:', text);
    
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

    return body;
  }
  
  /**
   * 
   * @param {string} text 
   * @param {*} options 
   */
  static #parseFooter(text, options) {
    const debug = options.debug ? logDebug : () => {};
    
    debug('ConventionalCommitParser#parseFooter', 'Parsing ConventionalCommit footer:', text);
    
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
        debug('ConventionalCommitParser#parseFooter', 'Separator not found.');
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
        debug('ConventionalCommitParser#parseFooter', 'BREAKING-CHANGE found.');
        footer.token = footerToken;
        result.breakingChange = true;
      } else {
        // Do not set result.breakingChange to false, just in case it's true already, which would overwrite it...
        const isAFooterToken = /^[\w-]+$/iu;
        if(!isAFooterToken.test(footerToken)) {
          debug('ConventionalCommitParser#parseFooter', `Token found in footer is not a valid token. Token: "${typeof footerToken === 'string' ? footerToken : typeof footerToken}"`);
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
        debug('ConventionalCommitParser#parseFooter', 'Footer:', footer);
      } else {
        // Separator found so continue with separating next footer's token from this footer's value...

        // A footer’s value MAY contain spaces and newlines, and parsing MUST terminate when the next
        // valid footer token/separator pair is observed.
        const currentValueAndNextTokenText = tempText.substring(0, nextTokenSeparatorIndex);
        
        // We now have footer value WITH token of next footer. We need to extract the token of next footer
        const extractNextToken = /[\w-]+$/igu;
        debug('ConventionalCommitParser#parseFooter', 'Trying to extract token from:', currentValueAndNextTokenText);
        const matched = extractNextToken.exec(currentValueAndNextTokenText);
        if(!matched) {
          debug('ConventionalCommitParser#parseFooter', `Couldn't parse token of next footer to determine where current footer value ends and next footer's token starts. footerValue: "${typeof currentValueAndNextTokenText === 'string' ? currentValueAndNextTokenText : typeof currentValueAndNextTokenText}"`);
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
        debug('ConventionalCommitParser#parseFooter', 'footer:', footer);
      }
      
      // Breaking changes MUST be indicated in the type/scope prefix of a commit, or as an entry in the footer.
      
      // If included as a footer, a breaking change MUST consist of the uppercase text BREAKING CHANGE,
      // followed by a colon, space, and description, e.g.,
      // BREAKING CHANGE: environment variables now take precedence over config files.
      // BREAKING-CHANGE MUST be synonymous with BREAKING CHANGE, when used as a token in a footer.
      // The units of information that make up Conventional Commits MUST NOT be treated as case
      // sensitive by implementors, with the exception of BREAKING CHANGE which MUST be uppercase.
    
    } while(tempText.length);
    
    return result;
  }
}
