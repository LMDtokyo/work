import { lazy } from "react";

export const SignupPage = lazy(() =>
  import("./SignupPage.tsx").then((module) => ({ default: module.Signup })),
);
