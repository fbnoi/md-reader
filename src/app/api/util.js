const bus = require('../bus');

module.exports = {
    openFilePage(filepath) {
        bus.send('page:open_file', filepath);
    },
    openDirPage(dirPath) {
        bus.send('page:open_folder', dirPath);
    },
    openIndexPage() {
        bus.send('page:open_index');
    },
    openDevDebug() {
        bus.send('dev:debug');
    },
}