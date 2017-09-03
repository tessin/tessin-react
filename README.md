# tessin-react

A conservative react boilerplate using a declarative routing strategy.

- Supports code splitting using webpack dynamic import `import(/* webpackChunkName: ... */ ...)`
- Higher-order component AsyncComponent can be unwrapped prior to ReactDOM.render or ReactDOMServer.renderToString see `unwrapAsyncComponent`
- Nested routes aren't supported out of the box but the pattern used can be applied recursivly.

## getting started

> `yarn run dev`

Nodemon is used to watch configuration files, if configuration files change the server (client and server) is restarted. Hot reloading is used throughout for everything else.

## bonus features

- Client and server webpack compilation run in seperate processes for better performance.

