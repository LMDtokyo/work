import { Link } from "react-router-dom";
import AuthButton from "../../../shared/ui/AuthButton/AuthButton";
import RememberCheckbox from "../../../shared/ui/RememberCheckbox/RememberCheckbox";
import AuthInput from "../../../shared/ui/AuthInput/AuthInput";
import { useForm } from "react-hook-form";
import useLogin from "../../../shared/api/hooks/useLogin";

export interface ISignupForm {
  email: string;
  password: string;
  repeatPassword: string;
}

function LoginForm() {
  const { register, handleSubmit, reset } = useForm<ISignupForm>({
    mode: "onChange",
  });

  const { mutate, isPending, isError, error } = useLogin(reset);

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
          Рады снова вас видеть!
        </h1>
        <h3 className="text-font-secondary font-normal text-[16px]">
          Давайте начнем! Введите свои данные
        </h3>
      </div>
      <div className="flex flex-col gap-5 mt-10">
        <AuthInput
          isPassword={false}
          placeholder="Email"
          {...register("email")}
          autoFocus
        />
        <AuthInput
          isPassword={true}
          placeholder="Пароль"
          {...register("password")}
        />
      </div>
      <div className="flex justify-between items-center w-125 px-2 mt-4">
        <RememberCheckbox />
        <Link
          to="/recovery-password"
          className="text-font-contrast underline-offset-2 underline text-sm hover:text-hover-font-contrast"
        >
          Забыли пароль?
        </Link>
      </div>
      {isError && (
        <div className="mt-3 p-2 px-4 bg-red-400/10 text-red-500 rounded-full border border-red-400 text-sm">
          {error.message}
        </div>
      )}
      <AuthButton text={isPending ? "Вход..." : "Войти"} />
      <p className="text-font-primary text-sm mt-5 text-center">
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
