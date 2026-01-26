import { lazy } from "react";

export const LoginPage = lazy(() =>
  import("./LoginPage.tsx").then((module) => ({ default: module.Login })),
);
