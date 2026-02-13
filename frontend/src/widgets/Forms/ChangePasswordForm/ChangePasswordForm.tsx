import { KeyRound } from "lucide-react";
import PrimaryInput from "../../../shared/ui/PrimaryInput/PrimaryInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IChangePasswordForm } from "./types";
import { changePasswordFormScheme } from "./scheme";
import PrimaryButton from "../../../shared/ui/PrimaryButton/PrimaryButton";
import { changePassword } from "../../../shared/api/requests/user";
import { useState } from "react";

function ChangePasswordForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IChangePasswordForm>({
    resolver: yupResolver(changePasswordFormScheme),
    mode: "onChange",
  });

  async function onSubmit(formData: IChangePasswordForm) {
    setStatus("loading");
    setErrorMsg("");
    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      setStatus("ok");
      reset();
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.[0]?.description ||
        err?.message ||
        "Не удалось сменить пароль";
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col bg-chat-secondary-bg py-4 px-4 md:px-8 md:py-6 pb-7 border border-chat-primary-border rounded-2xl w-full animate-fade-in-bottom">
      <div className="flex items-start sm:items-center gap-4 mb-5">
        <span className="p-2 sm:p-2.5 bg-chat-tertiary-bg/80 rounded-lg text-primary-font border border-chat-secondary-border">
          <KeyRound width={20} />
        </span>
        <div className="flex flex-col justify-center">
          <h2 className="text-primary-font font-semibold text-base sm:text-lg md:text-xl">
            Изменить пароль
          </h2>
          <p className="text-secondary-font text-xs sm:text-sm md:text-basic">
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
        {status === "ok" && (
          <p className="text-green-500 text-sm">Пароль успешно изменён</p>
        )}
        {status === "error" && (
          <p className="text-red-500 text-sm">{errorMsg}</p>
        )}
        <PrimaryButton
          text={status === "loading" ? "Сохраняем..." : "Изменить пароль"}
          className="mt-5"
          disabled={status === "loading"}
        />
      </form>
    </div>
  );
}

export default ChangePasswordForm;
