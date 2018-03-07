const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const StyleLintPlugin = require( 'stylelint-webpack-plugin' );

const pagesList = [
    {
        title: 'Books List',
        filename: 'index'
    },
    {
        title: 'Dashboard',
        filename: 'dashboard'
    }
];

const getHtmlWebpackPluginInstances = () => {
    return Object.values( pagesList ).map( page => {
        return new HtmlWebpackPlugin( {
            filename: `${ page.filename }.html`,
            template: `./src/templates/${ page.filename }.ejs`,
            title: `XBKS - ${ page.title }`,
            hash: true,
            favicon: './src/favicon.ico'
        } );
    } );
};

module.exports = {
    entry: [
        'babel-polyfill',
        './src/js/main.js',
        ...Object.values( pagesList ).map( page => `./src/templates/${ page.filename }.ejs` )
    ],
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve( __dirname, 'dist' )
    },
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: [
                    'raw-loader'
                ]
            },
            {
                test: /\.(ejs)$/,
                use: [
                    'underscore-template-loader'
                ]
            },
            {
                test: /\.(hbs)$/,
                loader: 'handlebars-loader',
                // query: {
                //     helpers: [ path.join( __dirname, 'handlebars-helpers', '**', '*.js' ) ],
                //     helperDirs: [
                //         path.join( __dirname, 'handlebars-helpers' )
                //     ]
                // }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    // 'file-loader?name=fonts/[name].[ext]'
                    'file-loader'
                ]
            },
            {
                enforce: 'pre',
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'eslint-loader'
            },
            {
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                options: {
                    presets: [ 'babel-preset-latest' ],
                    cacheDirectory: true
                }
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [ {
                    loader: 'url-loader',
                    options: {
                        limit: 8000, // Convert images < 8kb to base64 strings
                        name: 'assets/images/[hash]-[name].[ext]'
                    }
                } ]
            }
        ]
    },
    plugins: [
        new StyleLintPlugin( {
            configFile: '.stylelintrc'
        } ),
        ...getHtmlWebpackPluginInstances(),
        new CleanWebpackPlugin( [ 'dist' ] )
    ],
    devtool: 'source-map'
};
