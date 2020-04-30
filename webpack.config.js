const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { InjectManifest } = require('workbox-webpack-plugin');

let swSrc = path.resolve(__dirname, 'public/sw.js')

let plugins = [
  new webpack.ProvidePlugin({
    'popper.js': 'Popper'
  }),
  new VueLoaderPlugin(),
  new CopyPlugin([
    { from: './index.html', to: path.resolve(__dirname, 'dist/') },
    { from: './public', to: path.resolve(__dirname, 'dist/public') },
    { from: './src/pages', to: path.resolve(__dirname, 'dist/public') },
    { from: './src/routes', to: path.resolve(__dirname, 'dist/public') },
    { from: './src/assets', to: path.resolve(__dirname, 'dist/assets') },
    { from: './src/json', to: path.resolve(__dirname, 'dist/json') },
  ])
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(new MiniCssExtractPlugin())
  new InjectManifest({ swSrc, swDest: 'sw.js' })
}


module.exports = {
  entry: './src/assets/js/script/main.js',
  output: {
    filename: 'assets/js/script.min.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  externals: [
    { tether: 'tether' }
  ],
  devServer: {
    contentBase: [path.resolve(__dirname, 'dist/public'), path.join(__dirname, 'dist/assets')],
    publicPath: '/'
  },
  resolve: {
    alias: {

    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, 'src/assets/plugin'),
          path.resolve(__dirname, 'src/assets/vendor')
        ],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        exclude: [
          path.resolve(__dirname, 'src/assets/plugin'),
          path.resolve(__dirname, 'src/assets/vendor')
        ],
        use: [MiniCssExtractPlugin.loader, 'style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: [
          path.resolve(__dirname, 'src/assets/plugin'),
          path.resolve(__dirname, 'src/assets/vendor')
        ],
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|otf)$/,
        loader: 'url-loader?limit=100000',
        exclude: [
          path.resolve(__dirname, 'src/assets/plugin'),
          path.resolve(__dirname, 'src/assets/vendor')
        ],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        exclude: [
          path.resolve(__dirname, 'src/assets/plugin'),
          path.resolve(__dirname, 'src/assets/vendor')
        ],
      },
    ]
  },
  plugins
}