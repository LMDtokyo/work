import axios from "axios";
import { setupAuthInterceptor } from "./interceptor";

export const wbApi = axios.create({
  baseURL: "/api/Wildberries",
  timeout: 15000,
  withCredentials: true,
});

let _interceptorReady = false;

export function initWbApiInterceptor(onAuthFailure: () => void): void {
  if (_interceptorReady) return;
  setupAuthInterceptor(wbApi, onAuthFailure);
  _interceptorReady = true;
}
