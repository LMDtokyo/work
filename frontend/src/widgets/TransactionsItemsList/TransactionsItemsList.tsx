import TransactionItem from "../../shared/ui/TransactionItem/TransactionItem";
import type { OrderItem } from "../../shared/api/requests/wildberries";

function formatDate(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) +
    ", " +
    d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
  );
}

interface Props {
  orders: OrderItem[];
}

function TransactionsItemsList({ orders }: Props) {
  if (!orders.length) {
    return (
      <div className="flex items-center justify-center h-40 text-secondary-font text-xs sm:text-sm md:text-base">
        Нет заказов
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 w-full relative overflow-hidden">
      {orders.map((o) => (
        <TransactionItem
          key={o.id}
          productName={o.productName}
          status={o.status}
          totalPrice={o.totalPrice}
          currency={o.currency}
          date={formatDate(o.wbCreatedAt)}
          quantity={o.quantity}
        />
      ))}
    </div>
  );
}

export default TransactionsItemsList;
