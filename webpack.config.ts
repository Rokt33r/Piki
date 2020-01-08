import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import express from 'express'
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'

module.exports = (env, argv) => {
  const config = {
    entry: [
      './src/renderer/index.tsx'
      // the entry point of our app
    ],
    target: 'electron-renderer',

    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'compiled')
    },

    devtool: 'inline-source-map',

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        },
        {
          test: /\.tsx?$/,
          use: [{ loader: 'ts-loader' }],
          exclude: /node_modules/
        }
      ]
    },

    plugins: [
      new webpack.NamedModulesPlugin(),
      // prints more readable module names in the browser console on HMR updates

      new webpack.NoEmitOnErrorsPlugin(),
      // do not emit compiled assets that include errors
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),
      new ErrorOverlayPlugin()
      // new CopyPlugin([
      //   {
      //     from: path.join(__dirname, 'node_modules/codemirror/theme'),
      //     to: 'app/codemirror/theme'
      //   }
      // ]),
      // new CopyPlugin([
      //   {
      //     from: path.join(__dirname, 'static'),
      //     to: 'app/static'
      //   }
      // ])
    ],

    devServer: {
      host: 'localhost',
      port: 3000,

      historyApiFallback: {
        index: '/'
      },
      // respond to 404s with index.html

      hot: true,
      // enable HMR on the server

      before: function(app, server) {
        app.use(
          '/codemirror/mode',
          express.static(path.join(__dirname, 'node_modules/codemirror/mode'))
        )
        app.use(
          '/codemirror/addon',
          express.static(path.join(__dirname, 'node_modules/codemirror/addon'))
        )
        app.use(
          '/codemirror/theme',
          express.static(path.join(__dirname, 'node_modules/codemirror/theme'))
        )
        app.use('/static', express.static(path.join(__dirname, 'static')))
      }
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    node: {
      fs: 'empty'
    }
  }

  if (argv.mode === 'development') {
    config.plugins.unshift(new webpack.HotModuleReplacementPlugin())

    config.entry.unshift(
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server'
    )
    ;(config.output as any).publicPath = 'http://localhost:3000'
  }

  return config
}
