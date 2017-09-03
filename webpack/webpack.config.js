const { resolve } = require("path");

const webpack = require("webpack");

const ManifestPlugin = require("./ManifestPlugin");

function webpackConfigFactory(opts) {
  const { client, server, env } = Object.assign(
    { client: false, server: false, env: "development" }, // defaults
    opts // overrides
  );

  const config = {
    context: resolve(__dirname, "../src"),
    entry: {},
    output: {
      path: resolve(
        __dirname,
        `../build/${client ? "client" : server ? "server" : "unk"}`
      ),
      filename: "[name].[hash].bundle.js",
      publicPath: "/static/"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "babel-loader"
        }
      ]
    },
    plugins: [],
    devServer: {
      noInfo: true
    }
  };

  if (client) {
    config.entry.main = [
      // 1. polyfills
      // 2. react-hot-loader/patch
      // 3. ...
      // 4. entrypoint
      "react-hot-loader/patch",
      "webpack-hot-middleware/client",
      "./client-main"
    ];

    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new ManifestPlugin()
    );
  }

  if (server) {
    config.target = "node";

    config.output.libraryTarget = "this";

    config.entry.main = ["./server-main"];
  }

  return config;
}

module.exports = webpackConfigFactory;
