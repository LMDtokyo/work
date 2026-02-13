import { Link } from "react-router-dom";
import AccountItemsList from "../AccountItemsList/AccountItemsList";
import AddAccountButton from "../../shared/ui/AddAccountButton/AddAccountButton";
import styles from "./Accounts.module.css";
import { useState } from "react";
import AddAccountModal from "../AddAccountModal/AddAccountModal";
import AccountCategoryButtonsList from "../AccountCateogryButtonsList/AccountCategoryButtonsList";
import useAccountCategory from "../../shared/store/useAccountCategory";
import { ChevronLeft } from "lucide-react";

function Accounts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const accountCategory = useAccountCategory((state) => state.category);
  const setCategory = useAccountCategory((state) => state.setCategory);

  return (
    <div className="flex flex-col gap-2 sm:gap-3 py-4 sm:py-6 pb-4 px-4 md:px-6 lg:px-8 bg-chat-secondary-bg rounded-2xl border border-chat-primary-border w-full min-h-100 h-full overflow-hidden animate-fade-in-bottom">
      <div className="flex flex-col gap-4 justify-between sm:flex-row sm:items-center">
        <div className="flex items-start sm:items-center gap-4">
          {accountCategory.length > 0 && (
            <button
              onClick={() => setCategory("")}
              className="group text-primary-font cursor-pointer bg-chat-tertiary-bg hover:bg-chat-tertiary-bg-hover p-1.5 sm:p-2 rounded-full border border-chat-secondary-border duration-100"
            >
              <ChevronLeft className="group-hover:scale-115 duration-150" />
            </button>
          )}
          <div>
            <h2 className="text-primary-font text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
              Подключённые аккаунты
            </h2>
            <p className="text-secondary-font text-xs sm:text-sm md:text-[16px]">
              Управляйте своими торговыми площадками
            </p>
          </div>
        </div>
        {accountCategory.length > 0 && (
          <AddAccountButton onClick={() => setIsModalOpen(true)} />
        )}
      </div>
      <div className={`grow overflow-auto mt-4 ${styles.accounts}`}>
        {accountCategory.length > 0 ? (
          <AccountItemsList />
        ) : (
          <AccountCategoryButtonsList />
        )}
      </div>
      {accountCategory.length > 0 && (
        <div className="flex flex-col">
          <hr className="h-px border-none bg-linear-to-r from-chat-secondary-bg via-chat-secondary-border to-chat-secondary-bg mb-3" />
          <Link
            to="/app/accounts"
            className="text-contrast text-center text-sm sm:text-base hover:text-contrast-hover"
          >
            Смотреть все
          </Link>
        </div>
      )}
      {isModalOpen && <AddAccountModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
}

export default Accounts;
