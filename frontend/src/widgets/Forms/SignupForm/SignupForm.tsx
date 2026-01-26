import { Link } from "react-router-dom";
import AuthButton from "../../../shared/ui/AuthButton/AuthButton";
import AuthInput from "../../../shared/ui/AuthInput/AuthInput";
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

  const { mutate, isPending, isError, error, isSuccess } =
    useRegistration(reset);

  const submitForm = (data: ISignupForm) => {
    mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="animate-fade-in-bottom"
    >
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-font-primary font-bold text-[32px]">
          Начнём работу вместе!
        </h1>
        <h3 className="text-font-secondary font-normal text-[16px]">
          Всего несколько полей - и готово!
        </h3>
      </div>
      <div className="flex flex-col gap-5 mt-10">
        <AuthInput
          isPassword={false}
          placeholder="Email"
          errorMessage={errors.email?.message}
          autoFocus
          {...register("email")}
        />
        <AuthInput
          isPassword={true}
          placeholder="Пароль"
          errorMessage={errors.password?.message}
          {...register("password")}
        />
        <AuthInput
          isPassword={true}
          placeholder="Повторите пароль"
          errorMessage={errors.repeatPassword?.message}
          {...register("repeatPassword")}
        />
      </div>
      {isError && (
        <div className="mt-3 p-2 px-4 bg-red-400/10 text-red-500 rounded-full border border-red-400 text-sm">
          {error.message}
        </div>
      )}

      {isSuccess && (
        <div className="mt-3 p-2 px-4 bg-green-400/10 text-green-500 rounded-full border border-green-400 text-sm">
          Регистрация прошла успешно! Проверьте вашу почту.
        </div>
      )}
      <AuthButton
        text={isPending ? "Регистрация..." : "Начать работу"}
        disabled={isPending}
      />
      <p className="text-font-primary text-sm mt-5 text-center">
        Уже есть аккаунт?{" "}
        <Link
          to="/login"
          className="text-font-contrast underline-offset-2 underline hover:text-hover-font-contrast"
        >
          Войти
        </Link>
      </p>
    </form>
  );
}

export default SignupForm;
