import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import fs from "fs";
import util from "gulp-util";

let debug = require("debug")("webpack");

export default class WebpackTask {
  constructor(params = {}) {
    this.params = params;
  }

  static getConfigFile(params) {
    let { configFile } = params;

    if (configFile) {
      return module.parent.require(configFile);
    }
    else {
      let env = process.env.NODE_ENV === "production" ? "prd" : "dev";
      return require(`./config/${env}.config.js`)(params);
    }
  }

  static getDefaults() {
    return {
      entry: "::src/index.js",
      dist: "::dist",
      port: parseInt(process.env.PORT) + 1 || 3001,
      host: process.env.HOST || "localhost"
    };
  }

  enqueue(gulp, params, callback) {
    webpack(WebpackTask.getConfigFile(params), (err, stats) => {
      if (err) {
        throw new util.PluginError("webpack", err);
      }

      callback();
    });
  }

  generateWatcher(gulp, params) {
    return () => {
      let { serverFile } = params;

      if (serverFile) {
        require(path.join(process.cwd(), serverFile))(params);
      }
      else {
        let config = WebpackTask.getConfigFile(params);
        let { port, host } = params;
        let compiler = webpack(config);

        let server = new WebpackDevServer(compiler, {
          contentBase: `http://${params.host}:${params.port}`,
          quiet: true,
          noInfo: true,
          hot: true,
          publicPath: config.output.publicPath
        });

        return server.listen(params.port, params.host, () => {
          debug(
            "Webpack development server listening on %s:%s.",
            params.host,
            params.port
          );
        });
      }
    };
  }
}
