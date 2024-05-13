const path = require('path');
const fs = require('fs');

const { project } = require('../../app/workspace');
const { dree, dreeType } = require('../../lib/core/dree');
const markdown = require('../../lib/core/markdown');
const localImage = require('../../lib/marked/local-image');

module.exports = [
    {
        id: 'readDir',
        label: 'api:io:readDir',
        fn(dirPath) {
            const tree = dree(dirPath);
            const walk = (nodes, fn) => {
                nodes.forEach(node => {
                    fn(node);
                    if (node.children) {
                        walk(node.children, fn);
                    }
                });
            }
            let snapshot = project.getSnapshot();
            walk(tree, node => {
                if (snapshot.expandedDir && snapshot.expandedDir.indexOf(node.path) !== -1) {
                    node.expanded = true;
                }
                if (snapshot.selectedPath && snapshot.selectedPath == node.path) {
                    node.selected = true;
                }
            });
            return tree;
        },
    },
    {
        id: 'readFile',
        label: 'api:io:readFile',
        fn(filePath) {
            localImage.setBasePath(path.dirname(filePath));
            return {
                name: path.basename(filePath),
                path: filePath,
                type: dreeType.TYPE_FILE,
                doc: markdown.makeHtml(fs.readFileSync(filePath, { encoding: "UTF-8" }))
            };
        }
    }
];