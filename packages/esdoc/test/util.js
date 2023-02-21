import fs from 'fs-extra';

function find_imp(key, ...values) {
  const results = [];
    
  if(values.length === 1) {
    return global.docs.find( (doc) => {
      if(typeof values[0] === 'string') return doc[key] === values[0];
      if(values[0] instanceof RegExp) return doc[key].match(values[0]);
      return results;
    });
  }

  for(const value of values) {
    const result = global.docs.find( (doc) => {
      if (typeof value === 'string') return doc[key] === value;
      if (value instanceof RegExp) return doc[key].match(value);
      return '';
    });
    results.push(result);
  }

  return results;
}

// We're overriding find to throw instead of return undefined for testing report
export function find(key, ...values) {
  if(!global.docs || global.docs.length === 0) {
    throw new Error('ESDoc didn\'t generate any docs!');
  }
  
  if(typeof global.docs.find !== 'function') {
    throw new Error('global.docs do not have find() method!');
  }

  const result = find_imp( key, ...values );
  if( result === undefined ) {
    throw new Error(`Key '${key}' with '${values}' value is not found in generated documents. If you are implementing new feature, check if source file was correctly parsed to AST and if *Doc correctly processed it to ESDoc format.`);
  }

  return result;
}

export function file(filePath) {
    return fs.readFileSync(filePath).toString();
}
