import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthButton from "../../../shared/ui/AuthButton/AuthButton";
import RememberCheckbox from "../../../shared/ui/RememberCheckbox/RememberCheckbox";
import AuthInput from "../../../shared/ui/AuthInput/AuthInput";
import { FormError } from "../../../shared/ui/FormError";
import useLogin from "../../../shared/api/hooks/useLogin";
import { loginScheme } from "./scheme";
import type { LoginFormData } from "./types";

function LoginForm() {
  const [remember, setRemember] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginScheme),
    mode: "onBlur",
  });

  const { mutate, isPending, isError, error } = useLogin(reset);

  function onSubmit(data: LoginFormData) {
    mutate({ ...data, rememberMe: remember });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="animate-fade-in-bottom w-full max-w-[320px] sm:max-w-100 md:max-w-125"
    >
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-font-primary font-bold text-xl sm:text-2xl md:text-[28px] lg:text-[32px] text-center">
          Рады снова вас видеть!
        </h1>
        <h3 className="text-font-secondary font-normal text-sm sm:text-base text-center">
          Давайте начнем! Введите свои данные
        </h3>
      </div>
      <div className="flex flex-col gap-4 sm:gap-5 mt-6 sm:mt-8 md:mt-10">
        <AuthInput
          isPassword={false}
          placeholder="Email"
          errorMessage={errors.email?.message}
          maxLength={255}
          autoFocus
          {...register("email")}
        />
        <AuthInput
          isPassword
          placeholder="Пароль"
          errorMessage={errors.password?.message}
          maxLength={128}
          {...register("password")}
        />
      </div>
      <div className="flex justify-between items-center w-full px-2 mt-3 sm:mt-4">
        <RememberCheckbox checked={remember} onChange={setRemember} />
        <Link
          to="/recovery-password"
          className="text-font-contrast underline-offset-2 underline text-xs sm:text-sm hover:text-hover-font-contrast"
        >
          Забыли пароль?
        </Link>
      </div>
      {isError && <FormError message={error.message} />}
      <AuthButton text={isPending ? "Вход..." : "Войти"} />
      <p className="text-font-primary text-xs sm:text-sm mt-4 sm:mt-5 text-center">
        Вы здесь впервые?{" "}
        <Link
          to="/signup"
          className="text-font-contrast underline-offset-2 underline hover:text-hover-font-contrast"
        >
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
