import readdirp from 'readdirp';

class FileManager {
    getFiles( path, includes = [], excludes = [] ) {
        console.log('FileManager::getFiles', path, includes, excludes);
        const files = [];
        return files;
    }
}

export default new FileManager();
