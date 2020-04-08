const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

let plugins = [
  new VueLoaderPlugin(),
  new HtmlWebpackPlugin(),
  new CopyPlugin([
    { from: './public', to: path.resolve(__dirname, 'dist/public') },
    { from: './src/pages', to: path.resolve(__dirname, 'dist/public') },
    { from: './src/assets', to: path.resolve(__dirname, 'dist/assets') },
  ])
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(new MiniCssExtractPlugin())
}


module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [ MiniCssExtractPlugin.loader, 'style-loader', 'css-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|otf)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ]
  },
  plugins
}