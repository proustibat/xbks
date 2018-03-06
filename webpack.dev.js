const webpack = require( 'webpack' );
const merge = require( 'webpack-merge' );
const common = require( './webpack.common.js' );

module.exports = merge( common, {
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: [
                    'style-loader?sourceMap',
                    'css-loader?sourceMap',
                    'resolve-url-loader?sourceMap',
                    'sass-loader?sourceMap'
                ]
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: './dist',
        hot: true,
    },
} );
