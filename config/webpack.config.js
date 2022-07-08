const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "production",
    entry: {
        index: "./src/index.tsx"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js',
        library: "myLibrary",
        libraryTarget: 'umd',
        publicPath: '/', // 上线时配置的是cdn的地址
    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "app")
        ],
        // 用于查找模块的目录
        // extensions: [".js", ".json", ".jsx",".tsx", ".ts",".css"],
        alias: {

        }
    },
    devServer: {
        hot: true,
        https: false,
        compress: false,
        port: 4000,
        host: 'localhost',
        contentBase: './dist'
    },
    module: {
        rules: [{
                test: /.(js|jsx|ts|tsx)$/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/react',
                            '@babel/preset-typescript',
                        ],
                        plugins: [
                            ["@babel/plugin-proposal-decorators", {
                                "legacy": true
                            }]
                        ]
                    }
                }],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            },
            {
                test: /.css/,
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, 'css-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /.less/,
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, 'css-loader', 'less-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /.scss/,
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, 'css-loader', 'sass-loader'],
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /.(gif|jpg|png|bmp|eot|woff|woff2|ttf|svg)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        outputPath: 'images'
                    }
                }]
            }
        ]
    }
}