import { lazy } from "react";

export const TransactionsPage = lazy(() =>
  import("./TransactionsPage.tsx").then((module) => ({
    default: module.Transactions,
  })),
);
