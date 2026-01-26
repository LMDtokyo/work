import { lazy } from "react";

export const OfferPage = lazy(() =>
  import("./OfferPage.tsx").then((module) => ({ default: module.Offer })),
);
