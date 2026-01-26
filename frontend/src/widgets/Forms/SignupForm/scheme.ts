import * as yup from "yup";

const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const signupFormScheme = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Обязательное поле")
    .min(9, "Минимум 9 символов")
    .matches(regexEmail, "Введите корректный email"),
  password: yup
    .string()
    .trim()
    .required("Обязательное поле")
    .min(6, "Минимум 6 символов")
    .max(24, "Максимум 24 символа")
    .matches(
      regexPassword,
      "Пароль должен содержать не менее 6 символов и состоять только из латинских букв (a-z, A-Z) и цифр (0-9)",
    ),
  repeatPassword: yup
    .string()
    .trim()
    .required("Обязательное поле")
    .oneOf([yup.ref("password")], "Пароли не совпадают"),
});
