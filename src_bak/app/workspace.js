const { app, BrowserWindow } = require('electron');
const path = require('path');

const storage = require('../lib/core/storage');
const { id } = require('../lib/util/helper');

const _USER_APP_DATA_PATH_ = app.getPath('appData');
const _APP_DATA_PATH_ = path.join(_USER_APP_DATA_PATH_, 'md-reader/');
const _APP_HISTORY_PATH_ = path.join(_APP_DATA_PATH_, 'history.xml');
const _APP_PROJECTS_DIR_PATH_ = path.join(_APP_DATA_PATH_, 'projects');

const DEFAULT_WIN_WIDTH = 1028;
const DEFAULT_WIN_HEIGHT = 680;

const MAX_HISTORY_COUNT = 7;
const application_history_storage = storage.new('app:history', _APP_HISTORY_PATH_);

const project = {
    workingDir: null,
    snapshotStorage: null,
    projectId: null,
    setWorkingDir(dir) {
        this.workingDir = dir;
        this.projectId = id(dir);
        this.snapshotStorage = storage.new('project:' + this.projectId, this.getProjectSnapshotPath());
    },
    getWorkingDir() {
        return this.workingDir;
    },
    getWorkingProjectDir() {
        return path.join(_APP_PROJECTS_DIR_PATH_, this.projectId);
    },
    getWorkingCacheDir() {
        return path.join(_APP_PROJECTS_DIR_PATH_, this.projectId, 'cache');
    },
    getProjectSnapshotPath() {
        return path.join(_APP_PROJECTS_DIR_PATH_, this.projectId, 'snapshot.xml');
    },

    getProjectSnapshot() {
        return this.snapshotStorage.all();
    },

    addExpandedDir(dirPath) {
        let expandedDirs = this.snapshotStorage.get('expandedDir', []);
        if (expandedDirs.indexOf(dirPath) === -1) {
            this.snapshotStorage.add('expandedDir', dirPath);
        }
    },

    removeExpandedDir(dirPath) {
        let expandedDirs = this.snapshotStorage.get('expandedDir', []);
        let index = expandedDirs.indexOf(dirPath);
        if (index !== -1) {
            this.snapshotStorage.remove('expandedDir', index);
        }
    },

    setOpenedFile(filepath) {
        this.snapshotStorage.set('openedFile', filepath);
    },

    setSelectedPath(path) {
        this.snapshotStorage.set('selectedPath', path);
    }
}

const application = {
    _win: null,
    createMainWindow() {
        this._win = new BrowserWindow({
            width: DEFAULT_WIN_WIDTH,
            height: DEFAULT_WIN_HEIGHT,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true,
                nodeIntegration: false,
                enableRemoteModule: false,
                webSecurity: true
            }
        });
        this._win.setMenu(null);

        return this._win;
    },

    getWin() {
        return this._win;
    },

    addDirHistory(dirPath) {
        let removedIndex = [];
        let history = application_history_storage.get('dir', []);
        history.forEach((history, index) => {
            if (history.path === dirPath) {
                removedIndex.push(index);
            }
        });
        if (history.length >= MAX_HISTORY_COUNT) {
            for (let index = MAX_HISTORY_COUNT - 2; index < history.length; index++) {
                removedIndex.push(index);
            }
        }
        removedIndex.forEach(index => {
            application_history_storage.remove('dir', index);
        });
        application_history_storage.addInTop('dir', {
            name: path.basename(dirPath),
            path: dirPath,
            atime: new Date().getTime(),
        });
    },

    addFileHistory(filepath) {
        let removedIndex = [];
        let history = application_history_storage.get('file', []);
        history.forEach((history, index) => {
            if (history.path === filepath) {
                removedIndex.push(index);
            }
        });
        if (history.length >= MAX_HISTORY_COUNT) {
            for (let index = MAX_HISTORY_COUNT - 2; index < history.length; index++) {
                removedIndex.push(index);
            }
        }
        removedIndex.forEach(index => {
            application_history_storage.remove('file', index);
        });
        application_history_storage.addInTop('file', {
            name: path.basename(filepath),
            path: filepath,
            atime: new Date().getTime(),
        });
    },

    getHistory() {
        return application_history_storage.all();
    }
}

module.exports = { application, project };