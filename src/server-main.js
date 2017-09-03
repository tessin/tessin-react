// @flow

import React from "react";
import ReactDOMServer from "react-dom/server";

import { StaticRouter } from "react-router";
import { matchRoutes } from "react-router-config";

import App from "./App";

import routes from "./routes";

import { unwrapAsyncComponent } from "./common-main";

function ensureArray(x) {
  if (Array.isArray(x)) {
    return x;
  }
  return [x];
}

export async function render(req, res, { stats }) {
  const matches = matchRoutes(routes, req.path);

  // as part of the server render pass, for each matching route
  // we unwrap the AsyncComponent through it's resolve function
  await unwrapAsyncComponent(matches);

  const routerContext = {};

  const app = (
    <StaticRouter location={req.url} context={routerContext}>
      <App routes={routes} />
    </StaticRouter>
  );

  const serverHtml = ReactDOMServer.renderToString(app);

  const { assetsByChunkName } = stats;

  const assets = Array.prototype.concat.apply(
    ensureArray(assetsByChunkName.main),
    // perfetch named chunks
    matches
      .filter(({ route }) => route.webpackChunkName)
      .map(({ route }) =>
        ensureArray(assetsByChunkName[route.webpackChunkName])
      )
  );

  const x = {
    a: 1,
    b: 2
  };
  const y = {
    ...x,
    c: 3
  };

  res.send(`<!DOCTYPE html>
<html>
<body>
<div id="app">${serverHtml}</div>
<pre><code>${JSON.stringify({ assetsByChunkName }, null, 2)}</code></pre>
${assets
    .filter(fn => fn.endsWith(".js"))
    .map(fn => `<script src="/static/${fn}"></script>`)
    .join("\n")}
</body>
</html>`);
}
