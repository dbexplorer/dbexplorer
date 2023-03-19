const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin')
/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    entry: {
        jsdataexplorer: './src/index.ts'
    },

    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: [/node_modules/],
                loader: 'ts-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    { loader: MiniCssExtractPlugin.loader },
                    // Creates `style` nodes from JS strings
                    //"style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",

                ],
            }
        ]
    },
    resolve: { extensions: ['.js', '.ts', '.tsx'] },
    output: {
        chunkFilename: '[name].js',
        filename: '[name].js',
        library: 'JSDataExplorer',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
    },

    mode: 'development',
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/package.json',
                    to: '../dist/package.json'
                },
                {
                    from: './node_modules/jsdbmock/jsdbmock.js',
                    to: '../dist/jsdbmock.js'
                }
            ]
        })
    ],
    devtool: 'source-map',
    optimization: {
        splitChunks: false
    },
    devServer: {
        static: ['./demo/react', './dist'],
        compress: false,
        port: 8080
    },
    externals: {
        react: {
            root: "React",
            commonjs2: "react",
            commonjs: "react",
            amd: "react"
        },
        "react-dom": {
            root: "ReactDOM",
            commonjs2: "react-dom",
            commonjs: "react-dom",
            amd: "react-dom"
        },
    }
}
