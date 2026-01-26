import { lazy } from "react";

export const LandingPage = lazy(() =>
  import("./LandingPage.tsx").then((module) => ({ default: module.Landing })),
);
