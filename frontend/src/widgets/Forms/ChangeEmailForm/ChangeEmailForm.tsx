import { Mail } from "lucide-react";
import PrimaryInput from "../../../shared/ui/PrimaryInput/PrimaryInput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IChangePasswordForm } from "./types";
import { changePasswordFormScheme } from "./scheme";
import PrimaryButton from "../../../shared/ui/PrimaryButton/PrimaryButton";
import { useState } from "react";
import { useAuth } from "../../../shared/context/auth";

function ChangeEmailForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const { user } = useAuth();

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
      // TODO change method for Email
      console.log(formData);
      reset();
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.[0]?.description ||
        err?.message ||
        "Не удалось сменить почту";
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col bg-chat-secondary-bg py-4 px-4 md:px-8 md:py-6 pb-7 border border-chat-primary-border rounded-2xl w-full animate-fade-in-bottom">
      <div className="flex items-start sm:items-center gap-4 mb-5">
        <span className="p-2 sm:p-2.5 bg-chat-tertiary-bg/80 rounded-lg text-primary-font border border-chat-secondary-border">
          <Mail width={20} />
        </span>
        <div className="flex flex-col justify-center">
          <h2 className="text-primary-font font-semibold text-base sm:text-lg md:text-xl">
            Изменить почту
          </h2>
          <p className="text-secondary-font text-xs sm:text-sm md:text-basic">
            Актуальная почта — надежная связь с аккаунтом
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <PrimaryInput label="Текущая почта" value={user?.email} disabled />
        <PrimaryInput
          {...register("newEmail")}
          label="Новая почта"
          placeholder="Введите новую почту"
          errorMessage={errors.newEmail?.message}
          maxLength={128}
        />
        {status === "ok" && (
          <p className="text-green-500 text-sm">Почта успешно изменена</p>
        )}
        {status === "error" && (
          <p className="text-red-500 text-sm">{errorMsg}</p>
        )}
        <PrimaryButton
          text={status === "loading" ? "Сохраняем..." : "Изменить почту"}
          className="mt-5"
          disabled={status === "loading"}
        />
      </form>
    </div>
  );
}

export default ChangeEmailForm;
