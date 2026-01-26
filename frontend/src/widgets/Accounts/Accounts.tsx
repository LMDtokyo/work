import { Link } from "react-router-dom";
import AccountItemsList from "../AccountItemsList/AccountItemsList";
import AddAccountButton from "../../shared/ui/AddAccountButton/AddAccountButton";
import styles from "./Accounts.module.css";
import { useState } from "react";
import AddAccountModal from "../AddAccountModal/AddAccountModal";

function Accounts() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 py-6 pb-4 px-8 bg-chat-secondary-bg rounded-2xl border border-primary-border w-full h-full overflow-hidden animate-fade-in-bottom">
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
      <div className={`grow overflow-auto mt-4 ${styles.accounts}`}>
        <AccountItemsList />
      </div>
      <Link
        to="/app/profile/accounts"
        className="text-font-contrast text-center float-start hover:text-hover-font-contrast"
      >
        Смотреть все
      </Link>
      {isModalOpen && <AddAccountModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
}

export default Accounts;
