const { app } = require('electron');  
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
const fs = require('node:fs');
const path = require('node:path');
  
const userDataPath = app.getPath('userData');
const appCachePath = path.join(userDataPath, 'cache.xml');
const parser = new XMLParser();
const appCache = {};

const initAppCache = function () {
    fs.readFile(appCachePath, 'UTF-8', (err, data) => {
        if (err == null) {
            appCache = parser.parse(data);
        }
    });
}

module.exports = { initAppCache }
