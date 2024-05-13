const { dialog, shell } = require('electron');

const { application } = require('../../app/workspace');
const { openDirPage, openFilePage, openIndexPage, openDevDebug } = require('./util');

module.exports = [
    {
        id: 'getHistory',
        label: 'api:application:getHistory',
        fn() {
            return application.getHistory();
        },
    },
    {
        id: 'openDirDialog',
        label: 'api:application:openDirDialog',
        fn() {
            let dirs = dialog.showOpenDialogSync(application.win, { properties: ['openDirectory'] });
            dirs && openDirPage(dirs[0]);
        }
    },
    {
        id: 'openFileDialog',
        label: 'api:application:openFileDialog',
        fn() {
            let files = dialog.showOpenDialogSync(application.win, { properties: ['openFile'] });
            files && openFilePage(files[0]);
        }
    },
    {
        id: 'openIndexPage',
        label: 'api:application:openIndexPage',
        fn() {
            openIndexPage();
        }
    },
    {
        id: 'openDirPage',
        label: 'api:application:openDirPage',
        fn(dirPath) {
            openDirPage(dirPath);
        }
    },
    {
        id: 'openFilePage',
        label: 'api:application:openFilePage',
        fn(filepath) {
            openFilePage(filepath);
        }
    },
    {
        id: 'openDevDebug',
        label: 'api:application:openDevDebug',
        fn() {
            openDevDebug();
        }
    },
    {
        id: 'openExternal',
        label: 'api:application:openExternal',
        fn(link) {
            shell.openExternal(link);
        }
    },
]