const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.csv$/,
        type: 'asset/source'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.csv']
  }
}; 