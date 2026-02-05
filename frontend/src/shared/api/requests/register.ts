import { authApi, resetRefreshState } from "../../config/api/authApi";
import { handleApiError } from "../utils/errorHandler";

interface RegisterParams {
  email: string;
  password: string;
}

async function fetchRegister({ email, password }: RegisterParams) {
  try {
    const { data } = await authApi.post("/register", {
      email,
      password,
    });

    if (!data.isSuccess) {
      const errorMessage =
        data.errors?.[0]?.description || "Ошибка регистрации";
      throw new Error(errorMessage);
    }

    resetRefreshState();
    return data;
  } catch (error) {
    handleApiError(error, "Ошибка регистрации");
  }
}

export default fetchRegister;
