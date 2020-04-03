const path = require('path')
const babiliPlugin = require('babili-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let plugins = [
  new VueLoaderPlugin(),
  new HtmlWebpackPlugin()
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(new babiliPlugin())
}


module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist'
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
        use: ['style-loader', 'css-loader']
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