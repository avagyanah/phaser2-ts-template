const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: 'errors-only',
    host,
    port,
    overlay: {
      errors: true,
      warnings: true,
    },
  },
})

exports.cleanup = paths => ({
  plugins: [
    new CleanWebpackPlugin(paths, { root: process.cwd(), verbose: false }),
  ],
})

exports.loadJs = ({ babelOptions }) => ({
  module: {
    rules: [
      {
        test: /\.(ts?)|(js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: babelOptions,
          },
        ],
      },
      {
        test: /pixi\.js/,
        use: ['expose-loader?PIXI'],
      },
      {
        test: /phaser-arcade-physics\.js/,
        use: ['expose-loader?Phaser'],
      },
      {
        test: /phaser-nineslice\.js/,
        use: ['exports-loader?PhaserNineSlice'],
      },
      { test: /phaser-spine\.js/, use: ['exports-loader?PhaserSpine'] },
      {
        test: /phaser-super-storage\.js/,
        use: ['exports-loader?PhaserSuperStorage'],
      },
      {
        test: /phaser-i18next\.js/,
        use: [
          'imports-loader?this=>global',
          'imports-loader?i18next=i18next',
          'exports-loader?PhaserI18n',
        ],
      },
    ],
  },
})

exports.sourceMaps = method => ({
  devtool: method,
})

exports.envVar = env => ({
  plugins: [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(env),
    }),
  ],
})

exports.attachRevision = () => ({
  plugins: [
    new webpack.BannerPlugin({
      banner: new GitRevisionPlugin().version(),
    }),
  ],
})

exports.analyze = () => ({
  plugins: [new BundleAnalyzerPlugin()],
})

exports.injectVersion = version => ({
  plugins: [
    new webpack.DefinePlugin({
      __APP_VERSION__: JSON.stringify(version),
    }),
  ],
})
