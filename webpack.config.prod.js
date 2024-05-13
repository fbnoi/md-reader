const render = require('./webpack.render.config');
const preload = require('./webpack.preload.config');

module.exports = [render('production'), preload('production')]
