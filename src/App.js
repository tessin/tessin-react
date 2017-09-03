import React, { Component } from "react";

import { NavLink } from "react-router-dom";
import { renderRoutes } from "react-router-config";

export default class App extends Component {
  render() {
    const { routes } = this.props;

    return (
      <div>
        <h1>Hello World!</h1>

        <p>OK, great. We're hot!</p>

        <ul>
          <li>
            <NavLink to="/">/</NavLink>
          </li>
          <li>
            <NavLink to="/hello/">/hello/</NavLink>
          </li>
          <li>
            <NavLink to="/world/">/world/ (async)</NavLink>
          </li>
          <li>
            <NavLink to="/magic/">/magic/ (async)</NavLink>
          </li>
        </ul>

        {renderRoutes(routes)}
      </div>
    );
  }
}
