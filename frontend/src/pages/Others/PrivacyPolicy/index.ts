import { lazy } from "react";

export const PrivacyPolicyPage = lazy(() =>
  import("./PrivacyPolicy.tsx").then((module) => ({
    default: module.PrivacyPolicy,
  })),
);
