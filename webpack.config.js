'use strict'

const devMode = process.env.NODE_ENV !== 'production'
const pkg = require('./package.json')
const themeColor = '#37003c'

// project absolute paths
const paths = require('./build/paths')
const { output, script, styles, template } = paths

// load Webpack plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const WorkboxPlugin = require('workbox-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

// CSS parsers
const autoprefixer = require('autoprefixer')()
const cssnano = require('cssnano')({ preset: 'default' })

const config = {
  mode: devMode ? 'development' : 'production',
  entry: [ script, styles ],
  output: {
    path: output,
    publicPath: '/',
    filename: 'ecom.admin.[chunkhash].js'
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },

  // debug tools
  stats: {
    colors: true
  },
  devtool: 'source-map',
  performance: {
    hints: devMode ? false : 'warning',
    maxEntrypointSize: 1000000,
    maxAssetSize: 1000000
  },

  // setup development server
  devServer: {
    compress: true,
    port: 9900,
    contentBase: paths.output
  },

  // setup loaders
  module: {
    rules: [
      // parse SCSS and fix compiled CSS with Postcss
      {
        test: /\.s?css$/,
        use: [
          // fallback to style-loader in development
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              minimize: !devMode,
              plugins: [ autoprefixer, cssnano ]
            }
          },
          'sass-loader'
        ]
      },

      // transpile and polyfill JS with Babel
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [ 'babel-loader' ]
      }
    ]
  },

  // setup Webpack plugins
  plugins: [
    // clear dist folder
    new CleanWebpackPlugin(),

    // extract CSS to file
    new MiniCssExtractPlugin({
      filename: 'styles.[chunkhash].css'
    }),

    // create manifest.json file
    new WebpackPwaManifest({
      filename: 'manifest.json',
      name: 'E-Com Plus Admin',
      short_name: 'EComPlus',
      description: pkg.description,
      background_color: '#ffffff',
      theme_color: themeColor,
      crossorigin: 'use-credentials',
      icons: [ '96', '128', '192', '384', '512' ].map(size => ({
        src: paths[`icon${size}`],
        size: `${size}x${size}`
      }))
    }),

    // create service worker file
    new WorkboxPlugin.InjectManifest({
      swSrc: paths.sw,
      swDest: 'sw.js'
    }),

    // copy files from public folders recursivily
    new CopyPlugin([{
      from: paths.pub,
      to: output
    }]),

    // handle HTML view
    new HtmlWebpackPlugin({
      template,
      templateParameters: {
        BASE_URL: '/'
      },
      minify: !devMode && {
        collapseWhitespace: true,
        removeComments: true
      },
      meta: {
        'generator': pkg.name + '@' + pkg.version,
        'theme-color': themeColor
      }
    })
  ]
}

// check for verbose output option
if (process.argv.indexOf('--verbose') === -1) {
  // default Webpack output with less logs
  const { stats } = config
  stats.assets = stats.chunks = stats.modules = stats.children = false
}

module.exports = config
