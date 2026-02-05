import TransactionItem from "../../shared/ui/TransactionItem/TransactionItem";
import { mockTransactions } from "./mockData";

function TransactionsItemsList() {
  return (
    <div className="flex flex-col gap-1 w-full relative overflow-hidden">
      {mockTransactions.map((tx) => (
        <TransactionItem
          key={tx.id}
          title={tx.title}
          platform={tx.platform}
          sum={tx.sum}
          date={tx.date}
        />
      ))}
    </div>
  );
}

export default TransactionsItemsList;
