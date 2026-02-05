import { KeyRound } from "lucide-react";
import PrimaryInput from "../../../shared/ui/PrimaryInput/PrimaryInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IChangePasswordForm } from "./types";
import { changePasswordFormScheme } from "./scheme";
import PrimaryButton from "../../../shared/ui/PrimaryButton/PrimaryButton";

function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IChangePasswordForm>({
    resolver: yupResolver(changePasswordFormScheme),
    mode: "onChange",
  });

  function onSubmit() {
    console.log("+");
    reset();
  }

  return (
    <div className="flex flex-col bg-chat-secondary-bg px-8 py-6 pb-7 border border-primary-border rounded-2xl w-full animate-fade-in-bottom">
      <div className="flex items-center gap-4 mb-5">
        <span className="p-2.5 bg-chat-tertiary-bg/80 rounded-md text-font-primary">
          <KeyRound width={20} />
        </span>
        <div className="flex flex-col justify-center">
          <h2 className="text-font-primary font-semibold text-lg">
            Изменить пароль
          </h2>
          <p className="text-font-secondary text-sm">
            Обновите пароль для защиты аккаунта
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <PrimaryInput
          {...register("currentPassword")}
          label="Текущий пароль"
          placeholder="Введите текущий пароль"
          errorMessage={errors.currentPassword?.message}
          maxLength={128}
          isPassword
        />
        <PrimaryInput
          {...register("newPassword")}
          label="Новый пароль"
          placeholder="Придумайте новый пароль"
          errorMessage={errors.newPassword?.message}
          maxLength={128}
          isPassword
        />
        <PrimaryInput
          {...register("repeatPassword")}
          label="Подтвердите пароль"
          placeholder="Повторите новый пароль"
          errorMessage={errors.repeatPassword?.message}
          maxLength={128}
          isPassword
        />
        <PrimaryButton text="Изменитть пароль" className="mt-5" />
      </form>
    </div>
  );
}

export default ChangePasswordForm;
