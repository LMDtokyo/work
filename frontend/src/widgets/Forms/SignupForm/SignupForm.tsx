import { Link } from "react-router-dom";
import AuthButton from "../../../shared/ui/AuthButton/AuthButton";
import AuthInput from "../../../shared/ui/AuthInput/AuthInput";
import { FormError } from "../../../shared/ui/FormError";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ISignupForm } from "./types";
import { signupFormScheme } from "./scheme";
import useRegistration from "../../../shared/api/hooks/useRegistration";

function SignupForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ISignupForm>({
    resolver: yupResolver(signupFormScheme),
    mode: "onChange",
  });

  const { mutate, isPending, isError, error } = useRegistration(reset);

  const submitForm = (data: ISignupForm) => {
    mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="animate-fade-in-bottom w-full max-w-[320px] sm:max-w-100 md:max-w-125"
    >
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-primary-font font-bold text-xl sm:text-2xl md:text-[28px] lg:text-[32px] text-center">
          Начнём работу вместе!
        </h1>
        <h3 className="text-secondary-font font-normal text-sm sm:text-base text-center">
          Всего несколько полей - и готово!
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
        <AuthInput
          isPassword
          placeholder="Повторите пароль"
          errorMessage={errors.repeatPassword?.message}
          maxLength={128}
          {...register("repeatPassword")}
        />
      </div>
      {isError && <FormError message={error.message} />}
      <AuthButton
        text={isPending ? "Регистрация..." : "Начать работу"}
        disabled={isPending}
      />
      <p className="text-primary-font text-xs sm:text-sm mt-4 sm:mt-5 text-center">
        Уже есть аккаунт?{" "}
        <Link
          to="/login"
          className="text-contrast underline-offset-2 underline hover:text-contrast-hover"
        >
          Войти
        </Link>
      </p>
    </form>
  );
}

export default SignupForm;
