// @flow

export function unwrapAsyncComponent(matches) {
  return Promise.all(
    matches
      .filter(
        ({ route, match }) =>
          route.component && typeof route.component.resolve === "function"
      )
      .map(({ route, match }) =>
        route.component
          .resolve()
          .then(component => (route.component = component))
      )
  );
}
