import React from "react";
import { publicRoutes } from "../constants/routePath";

const publicRouterConfig = [
  {
    path: publicRoutes.EXAMPLE,
    component: React.lazy(() => import("../components/Example")),
  },
  {
    path: publicRoutes.LOGIN,
    component: React.lazy(() => import("../views/Auth/Login")),
  },
];

export default publicRouterConfig;
