var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    main: "./js/main.js",
    swagger: "./js/swagger-ui.js",
  },
  output: {
    path: __dirname + "/",
    filename: "./build/js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "postcss-loader", "sass-loader"],
        }),
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: "css-loader",
        }),
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|vendor|assets)/,
        loader: "babel-loader",
        options: {
          presets: ["env"],
        },
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin("./build/css/styles.css"),
    new webpack.DefinePlugin({ ENV: JSON.stringify(process.env.NODE_ENV) }),
  ],
};
