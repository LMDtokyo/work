import { lazy } from "react";

export const ProfilePage = lazy(() =>
  import("./ProfilePage.tsx").then((module) => ({ default: module.Profile })),
);
