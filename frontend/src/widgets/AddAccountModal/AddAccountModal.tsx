import { useForm } from "react-hook-form";
import { useAddWbAccount } from "../../shared/api/hooks/useWbAccounts";
import AuthButton from "../../shared/ui/AuthButton/AuthButton";

interface IAddAccountModal {
  setIsModalOpen: (value: boolean) => void;
}

interface FormData {
  shopName: string;
  apiToken: string;
}

function AddAccountModal({ setIsModalOpen }: IAddAccountModal) {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>();

  const closeModal = () => setIsModalOpen(false);

  const { mutate, isPending } = useAddWbAccount(closeModal);

  const onSubmit = (data: FormData) => {
    if (!data.shopName.trim()) {
      setError("shopName", { message: "Введите название" });
      return;
    }
    if (!data.apiToken.trim() || data.apiToken.length < 32) {
      setError("apiToken", { message: "Некорректный API ключ" });
      return;
    }

    mutate({
      shopName: data.shopName.trim(),
      apiToken: data.apiToken.trim(),
    });
  };

  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 bg-chat-secondary-bg rounded-2xl py-7 px-9 z-99 animate-fade-in-bottom">
        <div>
          <h2 className="text-font-primary font-semibold text-xl">
            Подключение аккаунта
          </h2>
          <p className="text-font-secondary">
            Введите данные для подключения к API маркетплейса
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <input
              {...register("shopName")}
              type="text"
              placeholder="Название магазина"
              disabled={isPending}
              className="bg-chat-tertiary-bg px-8 py-3 rounded-full outline-none font-normal text-font-primary w-125 shadow-[0_2px_4px_#00000025] placeholder:text-font-secondary disabled:opacity-60"
            />
            {errors.shopName && (
              <p className="text-red-400 text-sm mt-1 ml-4">{errors.shopName.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("apiToken")}
              type="password"
              placeholder="API ключ"
              disabled={isPending}
              className="bg-chat-tertiary-bg px-8 py-3 rounded-full outline-none font-normal text-font-primary w-125 shadow-[0_2px_4px_#00000025] placeholder:text-font-secondary disabled:opacity-60"
            />
            {errors.apiToken && (
              <p className="text-red-400 text-sm mt-1 ml-4">{errors.apiToken.message}</p>
            )}
          </div>
          <AuthButton
            text={isPending ? "Подключение..." : "Добавить"}
            disabled={isPending}
          />
        </form>
      </div>
      <div
        onClick={isPending ? undefined : closeModal}
        className="fixed top-0 left-0 w-full h-full bg-[#00000025] z-40 animate-fade-in"
      />
    </>
  );
}

export default AddAccountModal;
