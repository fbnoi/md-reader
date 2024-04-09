const path = require('path');
const localImage = require('../lib/marked/local-image');

const workspaceProperty = {
    appDir: __dirname,
    workingDir: __dirname,
};

const workspace = {
    getAppDir() {
        return workspaceProperty.appDir;
    },

    setWorkingDir(dir) {
        workspaceProperty.workingDir = dir;
        localImage.setWorkspace(dir);
    },

    getWorkingDir() {
        return workspaceProperty.workingDir;
    },

    getAppCacheDir() {
        return path.join(workspaceProperty.appDir, 'cache');
    },

    getWorkingCacheDir() {
        return path.join(workspaceProperty.workingDir, '.md-reader');
    }
}

module.exports = workspace;