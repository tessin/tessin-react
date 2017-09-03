import Hello from "./Hello";

import asyncComponent from "./async-component";

const routes = [
  {
    path: "/hello/",
    exact: true,
    strict: true,
    component: Hello
  },
  {
    path: "/world/",
    exact: true,
    strict: true,
    webpackChunkName: "async1",
    component: asyncComponent()(() =>
      import(/* webpackChunkName: "async1" */ "./World")
    )
  },
  {
    path: "/magic/",
    exact: true,
    strict: true,
    webpackChunkName: "async2",
    component: asyncComponent()(() =>
      import(/* webpackChunkName: "async2" */ "./Magic")
    )
  }
];

export default routes;
