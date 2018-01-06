const ExtractTextPlugin = require('extract-text-webpack-plugin');

var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: "./src/index.js",
  output: {
    path: __dirname + '/public',
    filename: "bundle.js",
    publicPath: '/public/'
  },
  module: {
    loaders: [
      {
        test: /\.js|.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.css$/,  
        include: /node_modules/,  
        loaders: ['style-loader', 'css-loader'],
       }
      // {
      //   test: /\.scss$/,
      //   loader: ExtractTextPlugin.extract('css-loader!sass-loader')
      // }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new ExtractTextPlugin({ filename: 'app.css', allChunks: true })
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
