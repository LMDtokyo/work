import { lazy } from "react";

export const SettingsPage = lazy(() =>
  import("./SettingsPage.tsx").then((module) => ({ default: module.Settings })),
);
