import { authApi, resetRefreshState } from "../../config/api/authApi";
import { handleApiError } from "../utils/errorHandler";

interface LoginParams {
  email: string;
  password: string;
  rememberMe: boolean;
}

async function fetchLogin({ email, password, rememberMe }: LoginParams) {
  try {
    const { data } = await authApi.post("/login", {
      email,
      password,
      rememberMe,
    });

    if (!data.isSuccess) {
      const errorMessage =
        data.errors?.[0]?.description || "Ошибка авторизации";
      throw new Error(errorMessage);
    }

    resetRefreshState();
    return data;
  } catch (error) {
    handleApiError(error, "Ошибка авторизации");
  }
}

export default fetchLogin;
