var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    bundle: "./entry.js",
    spheregrid: "./js/spheregrid.js",
  },
  output: {
    path: __dirname + "/build",
    filename: "./js/[name].js",
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
    new ExtractTextPlugin("./css/styles.css"),
    new webpack.DefinePlugin({
      ALGOLIA_PROJECT_ID: JSON.stringify(process.env.ALGOLIA_PROJECT_ID),
      ALGOLIA_PUBLIC_KEY: JSON.stringify(process.env.ALGOLIA_PUBLIC_KEY),
      ALGOLIA_INDEX: JSON.stringify(process.env.ALGOLIA_INDEX),
      ENV: JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};
