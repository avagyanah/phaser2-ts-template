const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const packagejson = require('../package.json')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default

const parts = require('./webpack.parts.config')

const phaserModule = path.resolve('node_modules/phaser-ce/')
const orangeGamesModule = path.resolve('node_modules/@orange-games/')
const config = require('../package.json')

const paths = {
  base: path.resolve('src'),
  app: path.resolve('src/Game.ts'),
  dist: path.resolve('dist'),
  template: path.resolve('index.html'),
  pixi: path.join(phaserModule, 'build/custom/pixi.js'),
  phaser: path.join(phaserModule, 'build/custom/phaser-arcade-physics.js'),
  phaserNineSlice: path.join(
    orangeGamesModule,
    'phaser-nineslice/build/phaser-nineslice.js',
  ),
  phaserSpine: path.join(
    orangeGamesModule,
    'phaser-spine/build/phaser-spine.js',
  ),
  phaserSuperStorage: path.join(
    orangeGamesModule,
    'phaser-super-storage/build/phaser-super-storage.js',
  ),
  phaseri18next: path.join(
    orangeGamesModule,
    'phaser-i18next/build/phaser-i18next.js',
  ),
  tsp: path.resolve('tps.sh'),
}

const commonConfig = merge([
  {
    target: 'web',
    context: paths.base,
    entry: {
      app: paths.app,
    },
    output: {
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].js',
      publicPath: '',
      path: paths.dist,
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        phaser: paths.phaser,
        'phaser-ce': paths.phaser,
        pixi: paths.pixi,
        phaserNineSlice: paths.phaserNineSlice,
        phaserSpine: paths.phaserSpine,
        phaserSuperStorage: paths.phaserSuperStorage,
        phaseri18next: paths.phaseri18next,
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: paths.template,
        title: packagejson.name,
        version: packagejson.version,
      }),
      new CaseSensitivePathsPlugin(),
      new CopyWebpackPlugin([
        {
          from: '../assets',
          to: 'assets',
        },
        {
          from: '../favicon.ico',
        },
      ]),
      new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
      new webpack.DefinePlugin({
        STORAGE_KEY: JSON.stringify(config.name),
      }),
    ],
  },

  parts.loadJs({
    babelOptions: {
      presets: [
        [
          '@babel/env',
          {
            modules: false,
            useBuiltIns: 'entry',
            shippedProposals: true,
          },
        ],
        '@babel/typescript',
        '@babel/stage-2',
      ],
      plugins: [],
    },
  }),

  parts.injectVersion(packagejson.version),
])

const developmentConfig = merge([
  parts.sourceMaps('cheap-module-source-map'),

  parts.devServer({ host: process.env.HOST, port: process.env.PORT }),

  { plugins: [new webpack.NamedModulesPlugin()] },

  parts.envVar('development'),
])

const productionConfig = merge([
  parts.sourceMaps('source-map'),

  parts.cleanup([paths.dist]),

  parts.envVar('production'),

  parts.attachRevision(),

  {
    performance: {
      maxEntrypointSize: 1200000,
      maxAssetSize: 1200000,
    },
    optimization: {
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        name: true,
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
  },
])

const analyzeConfig = merge([parts.analyze()])

module.exports = env => {
  const config = merge(
    commonConfig,
    env === 'production' ? productionConfig : developmentConfig,
  )

  if (process.env.npm_config_analyze) {
    return merge(config, analyzeConfig)
  }

  return config
}
