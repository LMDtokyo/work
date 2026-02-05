import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { authApi, initAuthApiInterceptor } from "../../config/api/authApi";
import { userApi, initUserApiInterceptor } from "../../config/api/userApi";
import { initWbApiInterceptor } from "../../config/api/wildberriesApi";
import { initChatApiInterceptor } from "../../config/api/chatApi";
import { AuthContext } from "./context";
import type { User, Theme } from "./types";

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

async function fetchCurrentUser(): Promise<User | null> {
  try {
    const { data } = await authApi.get("/me");
    if (data.isSuccess && data.data) {
      return data.data;
    }
    return null;
  } catch {
    return null;
  }
}

async function updateThemeOnServer(theme: Theme): Promise<Theme> {
  const { data } = await userApi.put("/theme", { theme });
  if (data.isSuccess && data.data) {
    return data.data.theme;
  }
  throw new Error(data.error || "Failed to update theme");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [localTheme, setLocalTheme] = useState<Theme>("dark");
  const interceptorsReady = useRef<boolean | null>(null);

  const handleAuthFailure = useCallback(() => {
    queryClient.setQueryData(["auth", "me"], null);
    queryClient.clear();
  }, [queryClient]);

  if (interceptorsReady.current === null) {
    initAuthApiInterceptor(handleAuthFailure);
    initUserApiInterceptor(handleAuthFailure);
    initWbApiInterceptor(handleAuthFailure);
    initChatApiInterceptor(handleAuthFailure);
    interceptorsReady.current = true;
  }

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const handlePopState = () => refetch();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [refetch]);

  const themeMutation = useMutation({
    mutationFn: updateThemeOnServer,
    onMutate: async (newTheme) => {
      await queryClient.cancelQueries({ queryKey: ["auth", "me"] });
      const previousUser = queryClient.getQueryData<User | null>([
        "auth",
        "me",
      ]);
      queryClient.setQueryData(["auth", "me"], (prev: User | null) => {
        if (!prev) return prev;
        return { ...prev, theme: newTheme };
      });
      return { previousUser };
    },
    onError: (_error, _newTheme, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(["auth", "me"], context.previousUser);
        applyTheme(context.previousUser.theme);
      }
    },
  });

  const theme = user?.theme ?? localTheme;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      applyTheme(newTheme);
      if (user) {
        themeMutation.mutate(newTheme);
      } else {
        setLocalTheme(newTheme);
      }
    },
    [user, themeMutation],
  );

  const logout = useCallback(async () => {
    await authApi.post("/logout").catch(() => {});
    queryClient.setQueryData(["auth", "me"], null);
    queryClient.clear();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.clear();
    setLocalTheme("dark");
    applyTheme("dark");
  }, [queryClient]);

  const value = {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    theme,
    setTheme,
    logout,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
