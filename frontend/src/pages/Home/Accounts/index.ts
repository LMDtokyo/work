import { lazy } from "react";

export const AccountsPage = lazy(() =>
  import("./AccountsPage.tsx").then((module) => ({ default: module.Accounts })),
);
