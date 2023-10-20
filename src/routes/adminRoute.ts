import React from "react";
import { privateRoutes } from "../constants/routePath";

const adminRouteConfig = [
  {
    path: privateRoutes.EXAMPLE,
    component: React.lazy(() => import("../components/Example")),
  },
];

export default adminRouteConfig;
