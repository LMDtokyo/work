import { lazy } from "react";

export const VerifyCodePage = lazy(() =>
  import("./VerifyCodePage.tsx").then((module) => ({
    default: module.VerifyCode,
  })),
);
