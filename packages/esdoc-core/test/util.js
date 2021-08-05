import fs from 'fs-extra';

export function find(key, ...values) {
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

export function file(filePath) {
    return fs.readFileSync(filePath).toString();
}
