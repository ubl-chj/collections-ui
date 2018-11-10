const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  node: {
    dgram: 'empty', fs: 'empty', net: 'empty', tls: 'empty', child_process: 'empty',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
      cache: true,
      parallel: true,
      sourceMap: false
    }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
    ]
  },
  entry: {
    'ignore':['./theming/index.ts'],
    'bundle':['./src/index.ts']
  },
  output: {
    path: path.join(__dirname, 'release'),
    filename: '[chunkhash:8].js',
    library:['Viewer'],
    libraryTarget:'umd',
    publicPath: ''
  },
  resolve: {
    extensions:['.js', '.ts', '.json', '.tsx', '.webpack.js', '.web.js', '.scss']
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
        oneOf: [
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
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9',
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
            ],
          },
          {
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          }
        ]
      }
    ]
  }
}
