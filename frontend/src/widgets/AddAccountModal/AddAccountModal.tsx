import AuthButton from "../../shared/ui/AuthButton/AuthButton";

interface IAddAccountModal {
  setIsModalOpen: (value: boolean) => void;
}

function AddAccountModal({ setIsModalOpen }: IAddAccountModal) {
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
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Название магазина"
            className="bg-chat-tertiary-bg px-8 py-3 rounded-full outline-none font-normal text-font-primary w-125 shadow-[0_2px_4px_#00000025] placeholder:text-font-secondary"
          />
          <input
            type="text"
            placeholder="API ключ"
            className="bg-chat-tertiary-bg px-8 py-3 rounded-full outline-none font-normal text-font-primary w-125 shadow-[0_2px_4px_#00000025] placeholder:text-font-secondary"
          />
          <AuthButton text="Добавить" />
        </form>
      </div>
      <div
        onClick={() => setIsModalOpen(false)}
        className="fixed top-0 left-0 w-full h-full bg-[#00000025] z-40 animate-fade-in"
      ></div>
    </>
  );
}

export default AddAccountModal;
