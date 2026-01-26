import { lazy } from "react";

export const ChatsPage = lazy(() =>
  import("./ChatsPage.tsx").then((module) => ({ default: module.Chats })),
);
