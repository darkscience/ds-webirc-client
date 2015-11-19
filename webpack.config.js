var path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'src/js'),
  entry: "./index",
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /.*\.jsx?/,
        loader: 'babel',
        include: path.resolve(__dirname, 'src/js')
      }
    ]
  },

  devtool: ['source-map']
}
