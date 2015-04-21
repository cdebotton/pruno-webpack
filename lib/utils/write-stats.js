import fs from "fs";
import path from "path";

export default (params) => {
  const FILEPATH = path.resolve(params.stats + "/webpack-stats.json");

  return function(stats) {
    let { publicPath } = this.options.output;
    let json = stats.toJson();

    const getChunks = (name, ext = "js") => {
      let chunk = json.assetsByChunkName[name];

      if (!Array.isArray(chunk)) {
        chunk = [chunk];
      }

      return chunk
        .filter(chunk => path.extname(chunk) === `.${ext}`)
        .map(chunk => publicPath + chunk);
    };

    let script = getChunks("bundle", "js");
    let css = getChunks("bundle", "css");

    fs.writeFileSync(FILEPATH, JSON.stringify({ script, css }));
  };
};
