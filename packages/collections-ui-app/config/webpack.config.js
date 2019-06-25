const fs = require('fs');
const isWsl = require('is-wsl');
const Dotenv = require('dotenv-webpack')
const path = require('path');
const webpack = require('webpack');
const resolve = require('resolve');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const TerserPlugin = require('terser-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const modules = require('./modules');
const getClientEnvironment = require('./env');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ForkTsCheckerWebpackPlugin = require('react-dev-utils/ForkTsCheckerWebpackPlugin');
const typescriptFormatter = require('react-dev-utils/typescriptFormatter');

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';
const useTypeScript = fs.existsSync(paths.appTsConfig);

module.exports = function(webpackEnv) {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';
  const publicPath = isEnvProduction
    ? paths.servedPath
    : isEnvDevelopment && '/';
  const publicUrl = isEnvProduction
    ? publicPath.slice(0, -1)
    : isEnvDevelopment && '';
  const env = getClientEnvironment(publicUrl);
  return {
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'inline-source-map',
    entry: [
      isEnvDevelopment &&
      require.resolve('react-dev-utils/webpackHotDevClient'),
      paths.appIndexJs,
    ].filter(Boolean),
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    module: {
      rules: [
        { parser: { requireEnsure: false } },
        {
          oneOf: [
            {
              include: paths.appSrc,
              test: /\.(ts|tsx)$/,
              use: [
                {loader: 'react-hot-loader/webpack'},
                {loader: 'awesome-typescript-loader'}
              ]
            },
            {
              test: /\.(sa|sc|c)ss$/,
              use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
          ],
        },
      ],
      strictExportPresence: true,
    },
    node: {
      child_process: 'empty', //eslint-disable-line
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      module: 'empty',
      net: 'empty',
      tls: 'empty',
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: !isWsl,
          sourceMap: shouldUseSourceMap,
          terserOptions: {
            compress: {
              comparisons: false,
              ecma: 5,
              inline: 2,
              warnings: false,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ascii_only: true, //eslint-disable-line
              comments: false,
              ecma: 5,
            },
            parse: {
              ecma: 8,
            },
          },
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
        }),
      ],
      runtimeChunk: true,
      splitChunks: {
        chunks: 'all',
        name: false,
      },
    },
    output: {
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'static/js/[name].chunk.js',
      devtoolModuleFilenameTemplate: isEnvProduction
        ? info =>
          path
            .relative(paths.appSrc, info.absoluteResourcePath)
            .replace(/\\/g, '/')
        : isEnvDevelopment &&
        (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'static/js/bundle.js',
      futureEmitAssets: true,
      path: isEnvProduction ? paths.appBuild : undefined,
      pathinfo: isEnvDevelopment,
      publicPath,
    },
    performance: false,
    plugins: [
      new Dotenv(),
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: isEnvDevelopment ? paths.devAppHtml : paths.appHtml,
          },
          isEnvProduction
            ? {
              minify: {
                collapseWhitespace: true,
                keepClosingSlash: true,
                minifyCSS: true,
                minifyJS: true,
                minifyURLs: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
              },
            }
            : undefined
        )
      ),
      isEnvProduction &&
      shouldInlineRuntimeChunk &&
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
      new MiniCssExtractPlugin({
        chunkFilename: '[chunkhash:8].css',
        filename: '[name].[contenthash].css',
      }),
      new ModuleNotFoundPlugin(paths.appPath),
      new webpack.DefinePlugin(env.stringified),
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      isEnvDevelopment &&
      new WatchMissingNodeModulesPlugin(paths.appNodeModules),
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        generate: (seed, files) => {
          const manifestFiles = files.reduce(function(manifest, file) {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          return {
            files: manifestFiles,
          };
        },
        publicPath,
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      isEnvProduction &&
      new WorkboxWebpackPlugin.GenerateSW({
        clientsClaim: true,
        exclude: [/\.map$/, /asset-manifest\.json$/],
        importWorkboxFrom: 'cdn',
        navigateFallback: publicUrl + '/index.html',
        navigateFallbackBlacklist: [
          new RegExp('^/_'),
          new RegExp('/[^/]+\\.[^/]+$'),
        ],
      }),
      useTypeScript &&
      new ForkTsCheckerWebpackPlugin({
        async: isEnvDevelopment,
        checkSyntacticErrors: true,
        formatter: isEnvProduction ? typescriptFormatter : undefined,
        reportFiles: [
          '**',
          '!**/__tests__/**',
          '!**/?(*.)(spec|test).*',
          '!**/src/setupProxy.*',
          '!**/src/setupTests.*',
        ],
        silent: true,
        tsconfig: paths.appTsConfig,
        typescript: resolve.sync('typescript', {
          basedir: paths.appNodeModules,
        }),
        useTypescriptIncrementalApi: true,
        watch: paths.appSrc,
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        'react-native': 'react-native-web',
      },
      extensions: paths.moduleFileExtensions
        .map(ext => `.${ext}`)
        .filter(ext => useTypeScript || !ext.includes('ts')),
      modules: ['node_modules', paths.appNodeModules].concat(modules.additionalModulePaths || []),
      plugins: [
        PnpWebpackPlugin,
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson]),
      ],
    },
    resolveLoader: {
      plugins: [
        PnpWebpackPlugin.moduleLoader(module),
      ],
    },
  };
};
