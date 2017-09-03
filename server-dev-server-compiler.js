// the server compilation process is running in it's own process

var webpack = require("webpack");
var webpackConfig = require("./webpack/webpack.config");

let compilerServerConfig, compilerServer;

function start(config) {
  if (compilerServer) throw new Error("server compilation is started!");

  compilerServerConfig = webpackConfig(config);
  compilerServer = webpack(compilerServerConfig);

  compilerServer.watch({}, (err, stats) => {
    const { hash, startTime, endTime } = stats;

    console.log(
      `webpack built ${hash} in ${endTime - startTime}ms (server-side)`
    );

    if (err) {
      console.error(
        "Error: an error occured while compiling the server-side bundle"
      );
      console.error("----------------");
      console.error(err);
      console.error("----------------");
      return;
    }

    if (stats.hasErrors()) {
      console.error(
        "Error: an error occured while compiling the server-side bundle"
      );
      const { errors } = stats.toJson("errors-only");
      for (const error of errors) {
        console.error("----------------");
        console.error(error);
      }
      console.error("----------------");
      return;
    }

    const { assetsByChunkName } = stats.toJson({ chunks: true });

    process.send({
      assetsByChunkName
    });
  });
}

process.on("message", msg => {
  switch (msg.cmd) {
    case "start": {
      start(msg.config);
      break;
    }
    default: {
      console.error(`[${process.pid}] unknown command "${msg.cmd}"`);
      break;
    }
  }
});
