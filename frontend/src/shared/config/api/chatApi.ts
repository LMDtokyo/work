import axios from "axios";
import { setupAuthInterceptor } from "./interceptor";

export const chatApi = axios.create({
  baseURL: "/api/v1/chats",
  timeout: 5000,
  withCredentials: true,
});

let interceptorInitialized = false;

export function initChatApiInterceptor(onAuthFailure: () => void): void {
  if (interceptorInitialized) return;
  setupAuthInterceptor(chatApi, onAuthFailure);
  interceptorInitialized = true;
}
