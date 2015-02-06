# pruno-webpack

Build your pruno application with Webpack. this mix supports webpack-dev-server, react-hot-loader, uglification, dedupification, and multiple bundles through YAML configuration. Alternatively, you can point webpack at your own webpack.config.js file with the config option and have full control.

## Usage
```js
"use strict";

var pruno = require('pruno');
pruno(function(mix) {
    mix
      .configure({ dir: __dirname + '/config' })
      .webpack({
        entry: '::src/index.js',
        dist: '::dist/bundle.js',
        'hot-load': true,
        uglify: false,
        devtool: 'eval-source-map'
      })
});
```
