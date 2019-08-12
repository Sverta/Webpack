// basic vars

const path = require('path');
const webpack = require('webpack');

// additional plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

var isProduction = (process.env.NODE_ENV === 'production');

//module settings
module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        app: [
            './js/app.js',
            './scss/style.scss'
        ],
    },

    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: "../"
    },
    
    // devServer configuration
    devServer: {
        publicPath: "/dist/",
        contentBase: path.join(__dirname, 'app')
        // compress: true,
        // port: 9000
    },

    devtool: (isProduction) ? '' : 'inline-source-map',

    module: {
        rules: [
        
            // scss
            {
                test: /\.(sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { url: false, sourceMap: true } },
                    { loader: 'postcss-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } }
                ]
            },

            // images
            {
                test: /\.(png|gif|jpe?g|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[hash].[ext]'
                        }
                    },
                    'img-loader',
                ]
            },
            // fonts
            {
                test: /\.(woff|woff2|eot|ttf|oft)$/,
                use:[
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            JQuery: 'jquery',
            Jquery: 'jquery',
            Popper: ['popper.js', 'default']
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: './css/[name].css',
            // chunkFilename: '[id].css',
        }),
        new CleanWebpackPlugin(),

        // if need to past img from html
        new CopyWebpackPlugin(
            [
                { from: './img', to: 'img'}
            ],
            {
                ignore: [
                    {glob:'svg/*'}
                ]
            }
        )
    ],
};

// production only block
if(isProduction) {
    module.exports.plugins.push(
        new UglifyJsPlugin({
            sourceMap: true
        }) 
    );
    module.exports.plugins.push(
        new ImageminPlugin({
            test: /\.(png|gif|jpe?g|svg)$/i
        }) 
    );
    module.exports.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }) 
    )
}