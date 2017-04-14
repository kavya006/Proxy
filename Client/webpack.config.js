module.exports = {
  cache : false,
  entry: './app/main.js',
  output: {
    path: './app',
    filename: 'bundle.js'
  },
  devServer: {
    inline: true,
    historyApiFallback: true,
    contentBase: './app',
    port: 8100
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
