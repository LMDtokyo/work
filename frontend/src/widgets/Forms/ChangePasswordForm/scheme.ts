import * as yup from "yup";

const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

export const changePasswordFormScheme = yup.object().shape({
  currentPassword: yup.string().trim().required("Обязательное поле"),
  newPassword: yup
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
