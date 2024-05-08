const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development", // 或 'production'
    entry: {
        screen: "./src/js/screen.js",
        home: "./src/js/home.js",
        // file: "./src/js/file.js",
        // folder: "./src/js/folder.js"
    },
    // devtool: false,
    output: {  
        path: path.resolve(__dirname, 'dist'),  
        filename: 'js/[name].bundle.js' // 使用 [name] 占位符来根据入口点名称生成不同的 bundle 文件名
    },
    module: {
        rules: [
            {  
                test: /\.m?js$/,  
                exclude: /(node_modules|bower_components)/,  
                use: {
                    loader: 'babel-loader',  
                    options: {  
                        presets: ['@babel/preset-env']
                    }
                }  
            }, 
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ["file-loader"],
            },
            // ... 其他 loader 配置
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/html/home.html',
            filename: 'home.html',
            chunks: ['home', 'screen']
        }),
        // new HtmlWebpackPlugin({
        //     template: './src/html/file.html',
        //     filename: 'file.html',
        //     chunks: ['file', 'screen']
        // }),
        // new HtmlWebpackPlugin({
        //     template: './src/html/folder.html',
        //     filename: 'folder.html',
        //     chunks: ['folder', 'screen']
        // }),
        new CleanWebpackPlugin(), // 清理输出目录
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash].css", // 提取 CSS 到单独的文件
        }),
        // ... 其他插件配置
    ],
    optimization: {  
        splitChunks: {  
            cacheGroups: {  
                vendor: {  
                    test: /[\\/]node_modules[\\/]/,  
                    name: 'vendors',  
                    chunks: 'all'  
                }  
            }  
        }  
    },
};
