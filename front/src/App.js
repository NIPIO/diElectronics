import React from "react";
import { HashRouter, Route } from "react-router-dom";

import routes from "./routes";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shards-dashboard/styles/shards-dashboards.1.1.0.min.css";
// import "antd/dist/antd.css";
import "../src/style/custom-antd.css";
import Login from "./pages/Login/Login";

export default () => {
  let logueado = localStorage.getItem("logueado");

  if (!logueado) {
    return (
      <HashRouter>
        <Login />
      </HashRouter>
    );
  } else {
    logueado = JSON.parse(logueado);
  }

  return (
    <HashRouter>
      <div>
        {routes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={props => {
                return (
                  <route.layout {...props}>
                    <route.component {...props} />
                  </route.layout>
                );
              }}
            />
          );
        })}
      </div>
    </HashRouter>
  );
};
