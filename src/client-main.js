import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { Router } from "react-router";
import { matchRoutes } from "react-router-config";
import createBrowserHistory from "history/createBrowserHistory";

import App from "./App";

import routes from "./routes";

import { unwrapAsyncComponent } from "./common-main";

const history = createBrowserHistory();

const present = (Component, routes) => {
  const matches = matchRoutes(routes, window.location.pathname);
  unwrapAsyncComponent(matches).then(() => {
    ReactDOM.render(
      <AppContainer>
        <Router history={history}>
          <Component routes={routes} />
        </Router>
      </AppContainer>,
      document.getElementById("app")
    );
  });
};

if (module.hot) {
  // we don't need to re-import or re-require
  // but we have to re-reference the dep that changed
  // from within this callback

  module.hot.accept("./App", () => {
    present(App, routes);
  });

  module.hot.accept("./routes", () => {
    present(App, routes);
  });
}

present(App, routes);
