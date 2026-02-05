import * as yup from "yup";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const loginScheme = yup.object({
  email: yup
    .string()
    .trim()
    .required("Введите email")
    .max(255, "Слишком длинный email")
    .matches(emailRegex, "Некорректный формат"),
  password: yup
    .string()
    .required("Введите пароль")
    .max(128, "Максимум 128 символов"),
});
