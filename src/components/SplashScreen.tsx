import React from "react";
import { IBasicChild } from "../types/type";

const SplashScreen = ({ children }: IBasicChild) => {
  return children;
};

export default React.memo(SplashScreen);
