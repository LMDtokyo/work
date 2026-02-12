import * as yup from "yup";

const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const changePasswordFormScheme = yup.object().shape({
  newEmail: yup
    .string()
    .trim()
    .required("Обязательное поле")
    .min(9, "Минимум 9 символов")
    .matches(regexEmail, "Введите корректный email"),
});
