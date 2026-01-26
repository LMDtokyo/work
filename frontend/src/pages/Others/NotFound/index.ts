import { lazy } from "react";

export const NotFoundPage = lazy(() =>
  import("./NotFoundPage.tsx").then((module) => ({ default: module.NotFound })),
);
