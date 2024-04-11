const { app, BrowserWindow } = require('electron');
const path = require('path');

const localImage = require('../lib/marked/local-image');
const storage = require('../lib/core/storage');

const __USER_APP_DATA_PATH_ = app.getPath('appData');
const _APP_DATA_PATH_ = path.join(__USER_APP_DATA_PATH_, 'md-reader/');
const _APP_PROJECTS_PATH_ = path.join(_APP_DATA_PATH_, 'projects.xml');
const _APP_HISTORY_PATH_ = path.join(_APP_DATA_PATH_, 'history.xml');

const DEFAULT_WIN_WIDTH = 1028;
const DEFAULT_WIN_HEIGHT = 680;

const MAX_HISTORY_COUNT = 7;
const application_history_storage = storage.new('app:history', _APP_HISTORY_PATH_);

const workspaceProperty = {
    appDir: __dirname,
    workingDir: __dirname,
};

const project = {
    // _xmlBuilder: new XMLBuilder(),

    getAppDir() {
        return workspaceProperty.appDir;
    },

    setWorkingDir(dir) {
        workspaceProperty.workingDir = dir;
        localImage.setWorkspace(dir);
        // const projectFilepath = path.join(dir, PROJECT_FILE_PATH);
        // if (!fs.existsSync(projectFilepath)) {

        // }
    },

    getWorkingDir() {
        return workspaceProperty.workingDir;
    },

    getAppCacheDir() {
        return path.join(workspaceProperty.appDir, 'cache');
    },

    getWorkingProjectDir() {
        return path.join(workspaceProperty.workingDir, '.md-reader');
    },

    getWorkingCacheDir() {
        return path.join(workspaceProperty.workingDir, '.md-reader', CACHE_DIR_NAME);
    },

    getWorkingHistoryDir() {
        return path.join(workspaceProperty.workingDir, '.md-reader', HISTORY_DIR_NAME);
    },

    // _create_default_project_files(filepath) {
    //     const projectXmlObj = {
    //         history_file: "history.xml",
    //         cache_dir: "tmp/"
    //     };
    //     const xmlContent = this._xmlBuilder.build(projectXmlObj);
    //     fs.writeFileSync(xmlContent, filepath);
    // },

    // _create_default_history_files(filepath) {
    //     const historyXmlObj = {
    //         last_open_file: ""
    //     };
    //     const xmlContent = this._xmlBuilder.build(historyXmlObj);
    //     fs.writeFileSync(xmlContent, filepath);
    // }
}

const application = {
    _win : null,
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
