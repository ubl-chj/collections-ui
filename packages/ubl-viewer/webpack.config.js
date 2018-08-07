const path = require('path')
const webpack = require('webpack')
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  entry: {
    'ignore':['./theming/index.ts'],
    'bundle':['./src/index.ts']
  },
  output: {
    path: path.join(__dirname, 'release'),
    filename: '[name].js',
    library:['Viewer'],
    libraryTarget:'umd',
    publicPath: ''
  },
  resolve: {
    extensions:['.js', '.ts', '.tsx', '.webpack.js', '.web.js', '.scss']
  },

  plugins: [
  //  new webpack.BannerPlugin({banner:copyrightBanner, entryOnly:true}),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'theme.css',
      chunkFilename: '[id].[hash].css',
    })
  ],
  externals: {
    'react': {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom',
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: ['ts-loader'],
        include: [path.join(__dirname, 'src'),path.join(__dirname, 'theming')]
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(jpg|png|svg)$/,
        loaders: [
          'file-loader?name=[path][name].[ext]'
        ],
        include: path.join(__dirname, 'theming')
      }
    ]
  }
};
