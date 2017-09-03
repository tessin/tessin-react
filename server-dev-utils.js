function runServerCompiler(config) {
  const path = require("path");
  const fs = require("fs");
  const child_process = require("child_process");

  const proc = child_process.fork("./server-dev-server-compiler.js");

  const task = new Promise(resolve => {
    let context = { render: null };
    proc.on("message", stats => {
      const resolveContext = !context.render;

      const { assetsByChunkName, entrypoints } = stats;

      const main = Array.isArray(assetsByChunkName.main)
        ? assetsByChunkName.main[0]
        : assetsByChunkName.main;

      // important to normlize path otherwise delete require[fn] won't work cross platform
      const fn = path.normalize(
        path.resolve(__dirname, `build/server/${main}`)
      );

      // the main file name should be unique per build

      try {
        const serverRenderer = require(fn);

        // console.log("[require(fn)]", serverRenderer); // todo: verbose

        for (const func of ["render", "renderError"]) {
          if (!(typeof serverRenderer[func] === "function")) {
            console.warn(
              `Warning: server-side bundle does not export expected function '${func}'`
            );
            continue;
          }
          context[func] = serverRenderer[func];
        }

        context.requireError = null;
      } catch (requireError) {
        console.error(`Error: cannot load file '${fn}'`);
        console.error("----------------");
        console.error(requireError);
        console.error("----------------");
        context.requireError = requireError;
        return;
      } finally {
        if (context.fn) {
          delete require.cache[context.fn];
          fs.unlink(context.fn, err => err && console.warn(err));
          const sourceMap = `${fs.context}.map`;
          if (fs.existsSync(sourceMap)) {
            fs.unlink(sourceMap, err => err && console.warn(err));
          }
        }
        context.fn = fn;
      }

      if (resolveContext) {
        resolve(context);
      }
    });
  });

  proc.send(
    {
      cmd: "start",
      config
    },
    err =>
      err && console.error("cannot spawn/start server compiler process", err)
  );

  return {
    proc,
    task
  };
}

module.exports = {
  runServerCompiler
};
