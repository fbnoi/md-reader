const path = require("path");
const webpack = require('webpack'); 

module.exports = (env) => {
    return {
        mode: !env || env === 'development' ? 'development' : 'production',
        entry: "./src/app/preload.js",
        devtool: false,
        target: 'electron-preload',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'preload.js'
        },
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        }
                    }]
                },
            ],
        },
        plugins: [  
            new webpack.DefinePlugin({  
              'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            }),  
        ],
    }
};
