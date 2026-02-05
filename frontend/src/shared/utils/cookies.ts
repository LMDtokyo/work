const DEFAULT_MAX_AGE = 365 * 24 * 60 * 60;

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export function setCookie(
  name: string,
  value: string,
  options?: {
    maxAge?: number;
    path?: string;
    sameSite?: "Strict" | "Lax" | "None";
  },
): void {
  const maxAge = options?.maxAge ?? DEFAULT_MAX_AGE;
  const path = options?.path ?? "/";
  const sameSite = options?.sameSite ?? "Strict";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=${path}; max-age=${maxAge}; SameSite=${sameSite}`;
}

export function removeCookie(name: string, path = "/"): void {
  document.cookie = `${name}=; path=${path}; max-age=0`;
}
