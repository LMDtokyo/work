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
      className="animate-fade-in-bottom"
    >
      <div className="flex flex-col gap-1 items-center">
        <h1 className="text-font-primary font-bold text-[32px]">
          Восстановление пароля
        </h1>
        <h3 className="text-font-secondary font-normal text-[16px]">
          Пожалуйста, придумайте новый пароль
        </h3>
      </div>
      <div className="flex flex-col gap-5 mt-10">
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
