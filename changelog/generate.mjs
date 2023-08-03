// git log --max-count 20 |
// Select-String "commit" |
// % { $_.ToString().Trim('commit '); } |
// % { git diff-tree $_ --numstat } |
// % {
//     if($_.Length -ne 40) {
//       if( $_.IndexOf('packages/') -ne -1 ) {
//         $package_name = $_.Substring( $_.IndexOf('packages/') + 9 );
//         $package_name = $package_name.Substring( 0, $package_name.IndexOf('/') );
//         "package_name: " + $package_name + "`n" + $_;
//       } else {
//         $_;
//       }
//     } else {
//       "Commit: " + $_;
//     };
//   }

import { fork, exec } from 'node:child_process';
import { inspect } from 'node:util';
import ansic from 'ansi-colors';

/**
 * Runs NodeJS file (application) on `filePath`, with `args` passed as arguments to the application.
 * You can optionally set working directory as `cwd`. Received stdout and stderr are returned upon Promise completion.
 * 
 * @param {string} filePath - Application to run on NodeJS.
 * @param {any} [args] - Arguments to pass to the Application.
 * @param {string} [cwd] - Working directory for the Application.
 * @returns {Promise<{ error: Error|null, code: number, std: { out: string[], err: string[] }>}}
 */
export async function helperRunScriptAsync( filePath, args, cwd ) {
  return new Promise( (resolve, reject) => {
      if( !Array.isArray( args ) ) args = [args];
      
      const options = {
          stdio: 'pipe',
          timeout: 4000, // milliseconds
      };
      
      if( typeof cwd === 'string' ) options.cwd = cwd;
      
      const stdoutOutput = [], stderrOutput = [];
      const childProcess = fork( filePath, args, options );
      
      childProcess.stdout.on( 'data', (output) => {
          stdoutOutput.push( output.toString('utf-8') );
      });
      childProcess.stderr.on( 'data', (output) => {
          stderrOutput.push( output.toString('utf-8') );
      });
      
      childProcess.on( 'error', (error) => {
          // Error is returned as error property. The rest needs to be returned too.
          // eslint-disable-next-line prefer-promise-reject-errors
          reject( { error: error, code: error.code, std: { out: stdoutOutput, err: stderrOutput } } );
      });
      
      childProcess.on( 'close', (code) => {
          resolve( { error: null, code: code, std: { out: stdoutOutput, err: stderrOutput } } );
      });
  });
}

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

const result = await helperRunCommand('git log');

const commits = [];
let newCommit = { commit: '', author: '', date: '', rest: [] };

for(const singleTextCommit of result.std.out) {
  for(const line of singleTextCommit.split('\n')) {
    // Each commit log starts with "commit "
    if(line.startsWith('commit ')) {
      // Store the commit we just collected data for and begin new commit
      if(newCommit.commit !== '') {
        commits.push(newCommit);
        newCommit = { rest: [] };
      }
      newCommit.commit = line.substring(7);
    } else if (line.startsWith('Author: ')) {
      newCommit.author = line.substring(8);
    } else if (line.startsWith('Date:   ')) {
      newCommit.date = line.substring(8);
    } else {
      // Ignore empty lines
      if(line.trim().length) {
        newCommit.rest.push(line.trim());
      }
    }
  }
  commits.push(newCommit);
}

const total = commits.length;
let current = 0;
let steps = 10;
let stepCount = total / steps;
let multiplier = 1;
console.log('Working...');
for await(const commit of commits) {
  if( current > (stepCount*multiplier) ) {
    console.log(`${100/steps*multiplier}%`);
    multiplier += 1;
  }
  const gitDiffTreeResult = await helperRunCommand(`git diff-tree ${commit.commit} --numstat`);
  
  commit.files = [];
  commit.difftree = [];
  commit.packages = new Set();
  
  if(gitDiffTreeResult.error) {
    console.log('Error:', error);
  }
  
  if(gitDiffTreeResult.std.err.length) {
    console.log(ansic.red(gitDiffTreeResult.std.err.length));
  }
  
  //console.log(gitDiffTreeResult.std.out.length);

  for(const singleTextCommit of gitDiffTreeResult.std.out) {
    for(const line of singleTextCommit.split('\n')) {
      // We already have the commit hash, we used it to join the commit and diff-tree
      if(line === commit.commit) continue;
      // Ignore empty lines
      if(line.trim().length === 0) continue;
      // We expect [number]\t[number]\t[filepath]
      const split = line.split('\t');
      if(split.length === 3) {
        // We expect filepath as [packages/][package_name][/rest_of_path/][filename]
        const fileNameParts = split[2].split('/');
        if(fileNameParts[0] === 'packages') {
          // This is package
          commit.packages.add(fileNameParts[1]);
        }
        commit.files.push(split[2]);
      } else {
        commit.difftree.push(split);
      }
    }
  }
  
  commit.packages = Array.from(commit.packages);

  current += 1;
}
console.log('Finished...');


console.log('commits:\n\n', inspect(commits, false, 10, true));
