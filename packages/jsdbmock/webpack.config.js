const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TypedocWebpackPlugin = require('typedoc-webpack-plugin')
const Papa = require("papaparse");
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
const json5 = require('json5');

module.exports = {
    entry: {
        jsdbmock: './src/index.ts'
    },

    module: {
        rules: [
            {
                test: /\.(ts)$/,
                exclude: [/node_modules/],
                loader: 'ts-loader'
            },
            {
                test: /\.json5$/i,
                type: 'json',
                parser: {
                  parse: json5.parse,
                },
            },
            {
                test: /\.csv$/i,
                parser: {
                    parse: function(input) { 
                        let data = Papa.parse(input, {dynamicTyping: true}).data;
                        let fields = data.shift();
                        return {fields: fields, data: data};
                    },
                },
                type: 'json'
            }
        ]
    },
    resolve: { extensions: ['.ts', '.tsx'] },
    output: {
        chunkFilename: '[name].js',
        filename: '[name].js',
        library: {
            root: 'JSDBMock',
            amd: '[dashedname]',
            commonjs: '[dashedname]',
          },
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
    },

    mode: 'development',
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/package.json',
                    to: '../dist/package.json'
                }
            ]
        })
    ],
    devtool: 'source-map',
    optimization: {
        splitChunks: false
    },
    devServer: {
        static: ['./demo', './dist'],
        compress: false,
        port: 8080
    }
}
