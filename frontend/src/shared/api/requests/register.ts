import { authApi } from "../../config/api/authApi";

interface IRegister {
  email: string;
  password: string;
}

async function fetchRegister({ email, password }: IRegister) {
  const { data } = await authApi.post("/register", {
    email,
    password,
  });

  if (!data.isSuccess) {
    throw new Error(data.errors?.[0]?.description || "Ошибка регистрации");
  }
  return data;
}

export default fetchRegister;
