import { Routes as RTs, Route } from "react-router-dom";
import publicRouterConfig from "./publicRoute";
import PrivateRoute from "../services/PrivateRoute";
import adminRouteConfig from "./adminRoute";
import React from "react";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

const Routes = () => {
  return (
    <React.Suspense fallback={<>...</>}>
      <RTs>
        <Route element={<AuthLayout />}>
          {publicRouterConfig.map((route) => {
            const Component = route.component;
            return (
              <Route
                path={route.path}
                element={<Component />}
                key={route.path}
              />
            );
          })}
        </Route>
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            {adminRouteConfig.map((route) => {
              const Component = route.component;
              return (
                <Route
                  path={route.path}
                  element={<Component />}
                  key={route.path}
                />
              );
            })}
          </Route>
        </Route>
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </RTs>
    </React.Suspense>
  );
};

export default Routes;
