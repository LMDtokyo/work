import { lazy } from "react";

export const AppPage = lazy(() =>
  import("./AppPage.tsx").then((module) => ({ default: module.App })),
);
