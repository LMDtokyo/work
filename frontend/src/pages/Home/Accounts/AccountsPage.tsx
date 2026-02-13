import { useState } from "react";
import AddAccountButton from "../../../shared/ui/AddAccountButton/AddAccountButton";
import AccountItemsList from "../../../widgets/AccountItemsList/AccountItemsList";
import styles from "./AccountsPage.module.css";
import AddAccountModal from "../../../widgets/AddAccountModal/AddAccountModal";

export const Accounts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 py-4 sm:py-5 md:py-6 px-4 sm:px-6 md:px-8 bg-chat-secondary-bg rounded-2xl border border-chat-primary-border w-full h-full overflow-hidden animate-fade-in-bottom">
      <div className="flex flex-col gap-4 min-[500px]:flex-row justify-between min-[500px]:items-center">
        <div className="flex flex-col gap-1 sm:gap-0">
          <h2 className="text-primary-font text-base sm:text-lg md:text-xl font-semibold">
            Подключённые аккаунты
          </h2>
          <p className="text-secondary-font text-xs sm:text-sm md:text-base">
            Управляйте своими торговыми площадками
          </p>
        </div>
        <AddAccountButton onClick={() => setIsModalOpen(true)} />
      </div>
      <div className={`grow overflow-auto ${styles.accounts}`}>
        <AccountItemsList />
      </div>
      {isModalOpen && <AddAccountModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
};
