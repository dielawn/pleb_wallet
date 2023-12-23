const path = require('path')

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
            },
          },
        ],
      },
      resolve: {
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules',
        ],
        extensions: ['.js']
      }
}