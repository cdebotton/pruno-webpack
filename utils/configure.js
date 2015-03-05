"use strict";

var webpack = require('webpack');
var path = require('path');
var assign = require('object-assign');
var pwd = require('shelljs').pwd;

function configure(params, watch) {
  watch || (watch = false);

  var DEV = process.env.NODE_ENV === 'development';
  var dist = params.dist.split('/');
  var fileName = dist.pop();
  var entry = path.join(pwd(), params.entry);
  var plugins = generatePlugins(params, watch);
  var devtool = params.devtool ? '#' + params.devtool : false;
  var context = params.context || pwd();
  var port = params.devport || 9000;

  var bundle = watch ? [
    'webpack-dev-server/client?http://localhost:' + port + '/'
  ] : entry;

  if (watch && params['hot-load']) {
    bundle.push('webpack/hot/only-dev-server');
  }

  if (watch) {
    bundle.push(entry);
  }

  var jsLoaders = generateJSLoaders(params, watch);

  return {
    cache: true,
    context: context,
    devtool: devtool,

    entry: {
      bundle: bundle
    },

    output: {
      filename: fileName,
      path: path.join(pwd(), dist.join('/')),
      publicPath: 'http://localhost:' + port + '/dist/'
    },

    plugins: plugins,

    resolve: {
      extensions: ['', '.js', '.jsx', '.es6']
    },

    module: {
      loaders: [
        { test: /\.js$/, loaders: jsLoaders, exclude: /node_modules/ }
      ]
    }
  };
}

function generatePlugins(params, watch) {
  var plugins = [];

  if (params['hot-load'] && watch) {
    plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    );
  }

  var env = !watch ? 'production' : 'development';

  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(env)
      }
    })
  );

  if (params.uglify) {
    plugins.push(
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        comments: false
      }),
      new webpack.optimize.OccurenceOrderPlugin()
    );
  }

  return plugins;
}

function generateJSLoaders(params, watch) {
  var loaders = [];

  if (params['hot-load'] && watch) {
    loaders.push('react-hot');
  }

  if (params.es6 || params.react || params.harmony) {
    loaders.push('babel');
  }
  if (params.es7) {
    loaders.push('babel?experimental');
  }

  return loaders;
}

module.exports = configure;
