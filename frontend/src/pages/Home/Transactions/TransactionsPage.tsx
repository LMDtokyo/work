import TransactionsFilter from "../../../shared/ui/TransactionsFilter/TransactionsFilter";
import TransactionsItemsList from "../../../widgets/TransactionsItemsList/TransactionsItemsList";
import styles from "./TransactionsPage.module.css";

export const Transactions = () => {
  return (
    <div className="flex flex-col gap-6 py-6 px-8 bg-chat-secondary-bg rounded-2xl border border-primary-border w-full h-full overflow-hidden animate-fade-in-bottom">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-font-primary text-2xl font-semibold">
            История транзакций
          </h2>
          <p className="text-font-secondary">
            Управляйте своими торговыми площадками
          </p>
        </div>
        <TransactionsFilter />
      </div>
      <div className={`grow overflow-auto ${styles.transactions}`}>
        <TransactionsItemsList />
      </div>
    </div>
  );
};
