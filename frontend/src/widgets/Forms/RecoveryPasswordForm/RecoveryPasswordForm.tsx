import AuthButton from "../../../shared/ui/AuthButton/AuthButton";
import AuthInput from "../../../shared/ui/AuthInput/AuthInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IRecoveryPasswordForm } from "./types";
import { recoveryPasswordFormScheme } from "./scheme";
import { useNavigate } from "react-router-dom";

function RecoveryPasswordForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IRecoveryPasswordForm>({
    resolver: yupResolver(recoveryPasswordFormScheme),
    mode: "onChange",
  });

  const submitForm = (data: IRecoveryPasswordForm) => {
    console.log({ data });
    reset();
    navigate("/verify-code");
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="animate-fade-in-bottom w-full max-w-[320px] sm:max-w-100 md:max-w-125"
    >
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-font-primary font-bold text-xl sm:text-2xl md:text-[28px] lg:text-[32px] text-center">
          Восстановление пароля
        </h1>
        <h3 className="text-font-secondary font-normal text-sm sm:text-base text-center">
          Пожалуйста, придумайте новый пароль
        </h3>
      </div>
      <div className="flex flex-col gap-4 sm:gap-5 mt-6 sm:mt-8 md:mt-10">
        <AuthInput
          isPassword={false}
          placeholder="Email"
          errorMessage={errors.email?.message}
          {...register("email")}
          autoFocus
        />
        <AuthInput
          isPassword={true}
          placeholder="Новый пароль"
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
      <AuthButton text="Подтвердить" />
    </form>
  );
}

export default RecoveryPasswordForm;
