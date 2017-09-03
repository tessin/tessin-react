import React, { Component } from "react";

export default function asyncComponent() {
  return componentTaskFactory => {
    class AsyncComponent extends Component {
      static _componentTask;
      static resolve() {
        return (AsyncComponent.componentTask ||
          (AsyncComponent.componentTask = componentTaskFactory()))
          .then(cjs => {
            const component = cjs.default ? cjs.default : cjs;
            return component;
          });
      }

      componentWillUnmount() {
        this._unmounted = true;
      }

      render() {
        const Component = this.state && this.state.component;

        // resolution through render is only done by client
        if (!Component && typeof window === "object") {
          AsyncComponent.resolve().then(component => {
            if (!(this._unmounted === true)) {
              this.setState({ component });
            }
          });
        }

        if (Component) {
          return <Component />;
        }

        return null;
      }
    }

    return AsyncComponent;
  };
}
