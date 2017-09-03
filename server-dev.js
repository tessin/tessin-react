require("babel-polyfill");

const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const app = express();

const compilerConfigFactory = require("./webpack/webpack.config");

// ================
// Webpack client

const compilerConfig = compilerConfigFactory({
  client: true,
  env: "development"
});

const compiler = webpack(compilerConfig);

const compilerTask = new Promise(resolve => {
  const context = { stats: null };
  compiler.plugin("done", stats => {
    const resolveContext = !context.stats;
    context.stats = stats.toJson({ entrypoints: true });
    if (resolveContext) {
      resolve(context);
    }
  });
});

app.use(
  webpackDevMiddleware(
    compiler,
    Object.assign({}, compilerConfig.devServer, {
      publicPath: compilerConfig.output.publicPath
    })
  )
);

app.use(webpackHotMiddleware(compiler));

// ================
// Webpack server

const { runServerCompiler } = require("./server-dev-utils");

const serverCompiler = runServerCompiler({ server: true, env: "development" });

// ================

app.get("*", (req, res) => {
  console.log("<<<<", req.path, req.query);

  // todo: figure out how errors flow through promises...

  compilerTask.then(({ stats }) =>
    serverCompiler.task
      .then(({ render }) => render(req, res, { stats }))
      .catch(reason => {
        if (reason.stack) {
          res.send(reason.stack);
        } else {
          res.send(`${reason.constructor.name}: ${reason.message}`);
        }
      })
  );
});

// Express...

app.listen(3000, () => {
  console.log("listening on port 3000...");
});
