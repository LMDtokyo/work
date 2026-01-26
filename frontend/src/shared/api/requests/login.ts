import { authApi } from "../../config/api/authApi";

interface ILogin {
  email: string;
  password: string;
}

async function fetchLogin({ email, password }: ILogin) {
  const { data } = await authApi.post("/login", {
    email,
    password,
  });

  if (!data.isSuccess) {
    throw new Error(
      data.errors?.[0]?.description || data.message || "Ошибка авторизации",
    );
  }
  return data;
}

export default fetchLogin;
