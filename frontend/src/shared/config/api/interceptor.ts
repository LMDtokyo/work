import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

interface QueuedRequest {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}

let isRefreshing = false;
let refreshFailed = false;
let requestQueue: QueuedRequest[] = [];

function processQueue(error: Error | null = null): void {
  requestQueue.forEach((pending) => {
    if (error) {
      pending.reject(error);
    } else {
      pending.resolve();
    }
  });
  requestQueue = [];
}

async function refreshTokens(): Promise<boolean> {
  try {
    const response = await axios.post("/api/Auth/refresh", null, {
      withCredentials: true,
    });
    return response.data?.isSuccess === true;
  } catch {
    return false;
  }
}

function shouldAttemptRefresh(config: InternalAxiosRequestConfig): boolean {
  const url = config.url || "";
  const skipPaths = ["/login", "/register", "/refresh", "/logout", "/me"];
  return !skipPaths.some((path) => url.includes(path));
}

export function setupAuthInterceptor(
  instance: AxiosInstance,
  onAuthFailure?: () => void,
): void {
  instance.interceptors.response.use(
    (response) => {
      refreshFailed = false;
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (!originalRequest) {
        return Promise.reject(error);
      }

      const isUnauthorized = error.response?.status === 401;
      const isTooManyRequests = error.response?.status === 429;
      const hasNotRetried = !originalRequest._retry;
      const canRefresh = shouldAttemptRefresh(originalRequest);

      if (isTooManyRequests) {
        refreshFailed = true;
        return Promise.reject(error);
      }

      if (isUnauthorized && hasNotRetried && canRefresh && !refreshFailed) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            requestQueue.push({ resolve, reject });
          }).then(() => instance.request(originalRequest));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshed = await refreshTokens();

        if (refreshed) {
          refreshFailed = false;
          processQueue();
          isRefreshing = false;
          return instance.request(originalRequest);
        }

        refreshFailed = true;
        processQueue(new Error("Session expired"));
        isRefreshing = false;

        if (onAuthFailure) {
          onAuthFailure();
        }
      }

      return Promise.reject(error);
    },
  );
}

export function resetRefreshState(): void {
  refreshFailed = false;
  isRefreshing = false;
  requestQueue = [];
}
