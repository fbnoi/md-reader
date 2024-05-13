const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "production",
    entry: {
        app: "./src/public/js/app.js",
        home: "./src/public/js/home.js",
        file: "./src/public/js/file.js",
        folder: "./src/public/js/folder.js",
        preload: "./src/app/preload.js"
    },
    devtool: false,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js' // 使用 [name] 占位符来根据入口点名称生成不同的 bundle 文件名
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
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        outputPath: 'image/',  // 指定输出到 dist 目录下的 fonts 子目录  
                    },
                }],
            },
            {
                test: /\.(ttf|woff2)$/,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[name][ext]"
                }
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/public/html/home.html',
            filename: 'home.html',
            chunks: ['home', 'app']
        }),
        new HtmlWebpackPlugin({
            template: './src/public/html/file.html',
            filename: 'file.html',
            chunks: ['file', 'app']
        }),
        new HtmlWebpackPlugin({
            template: './src/public/html/folder.html',
            filename: 'folder.html',
            chunks: ['folder', 'app']
        }),
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
    resolve: {
        fallback: {
            fs: false,
            path: false,
        }
    }
};
