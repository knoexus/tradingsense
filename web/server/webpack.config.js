const path = require('path');

module.exports = {
  mode: 'production',
  entry: './app.js',
  output: {
    filename: 'app.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  target: 'node',
  module: {
    rules: [
      {test: /\.txt$/, use: 'raw-loader'}
    ]
  },
};