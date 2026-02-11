import { useState, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import TransactionsFilter from "../../../shared/ui/TransactionsFilter/TransactionsFilter";
import TransactionsItemsList from "../../../widgets/TransactionsItemsList/TransactionsItemsList";
import { useOrders, ORDERS_KEY } from "../../../shared/api/hooks/useOrders";
import { useChatSocket } from "../../../shared/hooks/useChatSocket";
import styles from "./TransactionsPage.module.css";

// фильтр: 0=Все, 1=Доходы (delivered), 2=В процессе (new/confirmed/assembled/shipped), 3=Отмены (cancelled)
const statusGroups: Record<number, string[]> = {
  1: ["delivered"],
  2: ["new", "confirmed", "assembled", "shipped"],
  3: ["cancelled"],
};

export const Transactions = () => {
  const [filter, setFilter] = useState(0);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const { data, isLoading } = useOrders(page * pageSize, pageSize);
  const qc = useQueryClient();

  const handleNewOrder = useCallback(() => {
    qc.invalidateQueries({ queryKey: ORDERS_KEY });
  }, [qc]);

  useChatSocket(undefined, undefined, handleNewOrder);

  const filtered = useMemo(() => {
    if (!data?.items) return [];
    if (filter === 0) return data.items;
    const allowed = statusGroups[filter];
    return data.items.filter((o) => allowed?.includes(o.status));
  }, [data, filter]);

  return (
    <div className="flex flex-col gap-6 py-6 px-6 md:px-8 bg-chat-secondary-bg rounded-2xl border border-chat-primary-border w-full h-full overflow-hidden animate-fade-in-bottom">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center justify-between">
        <div>
          <h2 className="text-primary-font text-2xl font-semibold">
            История транзакций
          </h2>
          <p className="text-secondary-font">Все заказы с ваших аккаунтов WB</p>
        </div>
        <TransactionsFilter selected={filter} onChange={setFilter} />
      </div>
      <div className={`grow overflow-auto ${styles.transactions}`}>
        {isLoading ? (
          <div className="flex flex-col gap-3 py-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-chat-tertiary-bg rounded-xl h-16"
              />
            ))}
          </div>
        ) : (
          <TransactionsItemsList orders={filtered} />
        )}
      </div>
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-3">
          <button
            disabled={!data.hasPreviousPage}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-chat-tertiary-bg text-primary-font disabled:opacity-40 cursor-pointer disabled:cursor-default"
          >
            Назад
          </button>
          <span className="text-secondary-font self-center text-sm">
            {data.page} / {data.totalPages}
          </span>
          <button
            disabled={!data.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-chat-tertiary-bg text-primary-font disabled:opacity-40 cursor-pointer disabled:cursor-default"
          >
            Далее
          </button>
        </div>
      )}
    </div>
  );
};
