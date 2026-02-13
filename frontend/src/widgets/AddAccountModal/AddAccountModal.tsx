import { useForm } from "react-hook-form";
import { useAddWbAccount } from "../../shared/api/hooks/useWbAccounts";
import PrimaryButton from "../../shared/ui/PrimaryButton/PrimaryButton";
import { Unplug, X } from "lucide-react";
import PrimaryInput from "../../shared/ui/PrimaryInput/PrimaryInput";

interface IAddAccountModal {
  setIsModalOpen: (value: boolean) => void;
}

interface FormData {
  shopName: string;
  apiToken: string;
}

function AddAccountModal({ setIsModalOpen }: IAddAccountModal) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

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
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 bg-chat-secondary-bg rounded-2xl py-8 pb-11 px-4 sm:px-8 md:px-10 z-99 animate-fade-in-bottom w-full sm:min-w-150">
        <div className="flex items-start sm:items-center gap-4 mb-3">
          <span className="p-2.5 bg-chat-tertiary-bg/80 rounded-md text-contrast">
            <Unplug width={20} />
          </span>
          <div className="flex flex-col justify-center">
            <h2 className="text-primary-font font-semibold text-sm sm:text-base md:text-lg">
              Подключение аккаунта
            </h2>
            <p className="text-secondary-font text-xs sm:text-sm">
              Введите данные для подключения к API маркетплейса
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <PrimaryInput
              {...register("shopName")}
              label="Название магазина"
              placeholder="Придумайте название магазина"
              disabled={isPending}
              autoFocus
            />
            {errors.shopName && (
              <p className="text-red-400 text-sm mt-1 ml-4">
                {errors.shopName.message}
              </p>
            )}
          </div>
          <div>
            <PrimaryInput
              {...register("apiToken")}
              label="API ключ"
              placeholder="Введите API ключ от аккаунта"
              isPassword
              disabled={isPending}
            />
            {errors.apiToken && (
              <p className="text-red-400 text-sm mt-1 ml-4">
                {errors.apiToken.message}
              </p>
            )}
          </div>
          <PrimaryButton
            text={isPending ? "Подключение..." : "Добавить"}
            disabled={isPending}
            className="mt-3"
          />
        </form>
        <X
          width={32}
          height={32}
          onClick={() => setIsModalOpen(false)}
          className="absolute right-3 sm:right-5 top-3 sm:top-5 text-primary-font cursor-pointer rounded-full hover:bg-chat-tertiary-bg p-1 duration-100"
        />
      </div>
      <div
        onClick={isPending ? undefined : closeModal}
        className="fixed top-0 left-0 w-full h-full bg-[#00000080] z-40 animate-fade-in"
      />
    </>
  );
}

export default AddAccountModal;
