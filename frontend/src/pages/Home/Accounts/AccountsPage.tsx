import { useState } from "react";
import AddAccountButton from "../../../shared/ui/AddAccountButton/AddAccountButton";
import AccountItemsList from "../../../widgets/AccountItemsList/AccountItemsList";
import styles from "./AccountsPage.module.css";
import AddAccountModal from "../../../widgets/AddAccountModal/AddAccountModal";

export const Accounts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 py-6 px-8 bg-chat-secondary-bg rounded-2xl border border-primary-border w-full h-full overflow-hidden animate-fade-in-bottom">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-font-primary text-2xl font-semibold">
            Подключённые аккаунты
          </h2>
          <p className="text-font-secondary">
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
