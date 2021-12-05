const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // entry: './src/index.ts',
  entry: {
    entry1: './src/index.ts',
    entry2: './src/base/enum.ts'
  },
  output: {
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/tpl/index.html',
    }),
  ],
};
