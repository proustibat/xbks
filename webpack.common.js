const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const StyleLintPlugin = require( 'stylelint-webpack-plugin' );
const FaviconsWebpackPlugin = require( 'favicons-webpack-plugin' );

const pagesList = [
    {
        title: 'Books List',
        filename: 'index'
    },
    {
        title: 'Shopping Cart',
        filename: 'cart'
    }
];

const getHtmlWebpackPluginInstances = () => {
    return Object.values( pagesList ).map( page => {
        const pageTitle = `XBKS - ${ page.title }`;
        const header = `
            <header class="header">
                <h1 class="title">XBKS</h1>
                <ul class="menu">
                    ${ pagesList.map( pageLink => `<li class="${ pageLink.filename === page.filename ? 'is-active' : '' }"><a href="${ pageLink.filename }.html">${ pageLink.title }</a></li>` ).join( '' ) }
                    <li><a href="https://github.com/proustibat/xbks" target="_blank">Source</a></li>
                </ul>
            </header>`;
        return new HtmlWebpackPlugin( {
            filename: `${ page.filename }.html`,
            template: `./src/templates/${ page.filename }.ejs`,
            title: pageTitle,
            hash: true,
            favicon: './src/templates/favicon.ico',
            header: header
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
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader?name=fonts/[name].[ext]'
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
        new FaviconsWebpackPlugin( './src/templates/favicon.png' ),
        new CleanWebpackPlugin( [ 'dist' ] )
    ],
    devtool: 'source-map'
};
