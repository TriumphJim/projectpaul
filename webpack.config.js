const path = require('path');

module.exports = {
  entry: './src/script.js',  // Path to your main JavaScript file
  output: {
    filename: 'bundle.js',  // The name of the output file
    path: path.resolve(__dirname, 'dist'),  // The output directory
  },
  mode: 'development',  // or 'production'
};
