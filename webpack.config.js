'use strict'

const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const WorkboxPlugin = require('workbox-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const devMode = process.env.NODE_ENV !== 'production'

const dirBase = process.cwd()
const dirSrc = path.resolve(dirBase, 'src')
const dirScss = path.resolve(dirBase, 'scss')
const dirPublic = path.resolve(dirBase, 'public')
const dirImg = path.resolve(dirPublic, 'img')
const dirModules = path.resolve(process.cwd(), 'node_modules')
const dirOutput = path.resolve(process.cwd(), !devMode ? 'dist' : '.serve')

const entry = {
  admin: [path.resolve(dirScss, 'styles.scss')]
}
if (!devMode) {
  entry.admin.push(path.resolve(dirSrc, 'starter.js'))
}
entry.admin.push(path.resolve(dirSrc, 'index.js'))

const baseScssModule = [
  {
    loader: 'css-loader',
    options: {
      sourceMap: true
    }
  },

  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      minimize: !devMode,
      plugins: [
        require('autoprefixer')(),
        require('cssnano')({ preset: 'default' })
      ],
      sourceMap: true
    }
  },

  {
    loader: 'sass-loader',
    options: {
      sassOptions: {
        includePaths: [
          dirModules
        ],
        importer (file, prev, done) {
          if (file.startsWith('~')) {
            return done({ file: file.substr(1) })
          }
          done({ file })
        }
      },
      sourceMap: true
    }
  }
]

const config = {
  entry,
  mode: devMode ? 'development' : 'production',
  output: {
    path: dirOutput,
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: 'chunks/[name].js'
  },
  optimization: {
    minimizer: [new TerserPlugin()]
  },

  stats: {
    colors: true
  },
  devtool: 'source-map',
  performance: {
    hints: devMode ? false : 'warning',
    maxEntrypointSize: 1000000,
    maxAssetSize: 2000000
  },
  resolve: {
    mainFields: ['module', 'browser', 'main'],
    extensions: ['.wasm', '.mjs', '.js', '.json', '.vue'],
    alias: {
      '@': dirSrc
    }
  },

  externals: {
    jquery: 'jQuery',
    './fontawesome-icons': 'window',
    'bootstrap/js/dist/alert': 'window',
    'bootstrap/js/dist/button': 'window',
    'bootstrap/js/dist/collapse': 'window',
    'bootstrap/js/dist/dropdown': 'window',
    'bootstrap/js/dist/tab': 'window',
    'bootstrap/js/dist/tooltip': 'window',
    'bootstrap/js/dist/util': 'window'
  },

  devServer: {
    port: 9016,
    open: true,
    contentBase: [dirPublic],
    publicPath: '/',
    historyApiFallback: {
      rewrites: [
        { from: /\/login(\.html)?$/, to: '/' }
      ]
    }
  },

  plugins: [
    new HtmlWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: 'chunks/[name].css',
      ignoreOrder: true
    }),

    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false
    }),

    new CopyPlugin({
      patterns: [{
        from: dirPublic,
        to: dirOutput
      }]
    }),

    new VueLoaderPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.s?css$/,
        oneOf: [{
          resourceQuery: /^\?vue/,
          use: ['vue-style-loader'].concat(baseScssModule)
        }, {
          use: [MiniCssExtractPlugin.loader].concat(baseScssModule)
        }]
      },

      {
        test: /^(.(?!\.min\.js$))+\.m?js$/,
        exclude: /node_modules(?!\/@ecomplus\/[^/]+\/(?!dist))/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: '3.16',
                modules: false
              }]
            ],
            plugins: [
              '@babel/plugin-syntax-dynamic-import'
            ]
          }
        }
      },

      {
        test: /\.html$/,
        exclude: /(node_modules|vue|components)/,
        loader: 'html-loader'
      },

      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            whitespace: devMode ? 'preserve' : 'condense'
          }
        }
      },

      {
        test: /\.(png|woff|woff2|eot|ttf|svg|otf)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  }
}

if (!devMode) {
  config.plugins.push(
    new WorkboxPlugin.InjectManifest({
      swSrc: path.resolve(dirSrc, 'sw.js'),
      swDest: 'sw.js',
      exclude: [/.*/]
    }),

    new WebpackPwaManifest({
      name: 'E-Com Plus Admin',
      short_name: 'E-Com Plus Admin',
      description: 'E-Com Plus Cloud Commerce Solution',
      background_color: '#fafbfb',
      theme_color: '#37003c',
      crossorigin: 'use-credentials',
      icons: [{
        src: path.resolve(dirImg, 'icon.png'),
        sizes: [96, 128, 192]
      }, {
        src: path.resolve(dirImg, 'large-icon.png'),
        sizes: [384, 512]
      }]
    })
  )
}

module.exports = config
