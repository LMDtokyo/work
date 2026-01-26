import { lazy } from "react";

export const RecoveryPasswordPage = lazy(() =>
  import("./RecoveryPasswordPage.tsx").then((module) => ({
    default: module.RecoveryPassword,
  })),
);
