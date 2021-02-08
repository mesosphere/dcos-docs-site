var path = require("path");
var webpack = require("webpack");

var watch = false;

module.exports = (files, metalsmith, done) => {
  if (watch) return done();
  watch = process.env.NODE_ENV === "development";

  webpack(
    Object.assign(require(path.resolve("./webpack.config.js")), { watch }),
    (err, stats) => {
      if (err || stats.hasErrors()) console.error(err);
      console.log(stats.toString({ colors: true }));
      done();
    }
  );
};
