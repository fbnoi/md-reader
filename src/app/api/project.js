const { project } = require('../../app/workspace');

module.exports = [
    {
        id: 'addOpenDirCache',
        label: 'api:project:addOpenDirCache',
        fn(dirPath) {
            project.addExpandedDir(dirPath);
        },
    },
    {
        id: 'removeOpenDirCache',
        label: 'api:project:removeOpenDirCache',
        fn(dirPath) {
            project.removeExpandedDir(dirPath);
        },
    },
    {
        id: 'setOpenedFileCache',
        label: 'api:project:setOpenedFileCache',
        fn(filepath) {
            project.setOpenedFile(filepath);
        },
    },
    {
        id: 'getOpenedFileCache',
        label: 'api:project:getOpenedFileCache',
        fn() {
            return project.getSnapshot().openedFile;
        },
    },
    {
        id: 'setSelectedPathCache',
        label: 'api:project:setSelectedPathCache',
        fn(path) {
            project.setSelectedPath(path);
        },
    },
    {
        id: 'getNotes',
        label: 'api:project:getNotes',
        fn() {
            return project.getNotes();
        },
    },
    {
        id: 'addNote',
        label: 'api:project:addNote',
        fn(selection, note) {
            return project.addNote(selection, note);
        },
    },
    {
        id: 'removeNote',
        label: 'api:project:removeNote',
        fn(selection) {
            return project.removeNote(selection);
        },
    }
]
