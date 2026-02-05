import { Link } from "react-router-dom";
import TransactionsItemsList from "../TransactionsItemsList/TransactionsItemsList";
import TransactionsFilter from "../../shared/ui/TransactionsFilter/TransactionsFilter";
import styles from "./Transactions.module.css";

function Transactions() {
  return (
    <div className="flex flex-col gap-3 py-6 pb-4 px-8 bg-chat-secondary-bg rounded-2xl border border-primary-border w-full h-full overflow-hidden animate-fade-in-bottom">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-font-primary text-2xl font-semibold">
            История транзакций
          </h2>
          <p className="text-font-secondary">Все операции по вашим площадкам</p>
        </div>
        <TransactionsFilter />
      </div>
      <div className={`grow overflow-auto mt-4 ${styles.transactions}`}>
        <TransactionsItemsList />
      </div>
      <div className="flex flex-col">
        <hr className="h-px border-none bg-linear-to-r from-chat-secondary-bg via-primary-border to-chat-secondary-bg mb-3" />
        <Link
          to="/app/profile/transactions"
          className="text-font-contrast text-center hover:text-hover-font-contrast"
        >
          Смотреть все
        </Link>
      </div>
    </div>
  );
}

export default Transactions;
