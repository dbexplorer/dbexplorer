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

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: {
        jsdataexplorer: path.resolve(__dirname, 'src/index.ts')
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
    resolve: { extensions: ['.ts', '.tsx'] },
    output: {
        chunkFilename: '[name].js',
        filename: '[name].js',
        library: 'JSDataExplorer',
        libraryTarget: 'umd'
    },

    mode: 'development',
    plugins: [
        new CleanWebpackPlugin(),
        //new UglifyJSPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),

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
        static: ['./demo/react', './dist'],
        compress: false,
        port: 8080
    }
}
