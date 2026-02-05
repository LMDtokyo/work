import { lazy } from "react";

export const SubscriptionPage = lazy(() =>
  import("./SubscriptionPage.tsx").then((module) => ({
    default: module.Subscription,
  })),
);
