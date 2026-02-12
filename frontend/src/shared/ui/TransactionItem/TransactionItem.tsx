import { ArrowUpRight, ArrowDownLeft, X } from "lucide-react";

interface Props {
  productName: string | null;
  status: string;
  totalPrice: number;
  currency: string;
  date: string;
  quantity: number;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "delivered":
      return {
        bg: "bg-green-bg-20",
        text: "text-green-bg",
        icon: ArrowUpRight,
        prefix: "+",
      };
    case "cancelled":
      return {
        bg: "bg-red-500/20",
        text: "text-red-500",
        icon: X,
        prefix: "-",
      };
    default:
      return {
        bg: "bg-yellow-500/20",
        text: "text-yellow-500",
        icon: ArrowDownLeft,
        prefix: "",
      };
  }
}

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    new: "Новый",
    confirmed: "Подтверждён",
    assembled: "Собран",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменён",
  };
  return map[s] || s;
}

function TransactionItem({
  productName,
  status,
  totalPrice,
  currency,
  date,
  quantity,
}: Props) {
  const style = getStatusStyle(status);
  const Icon = style.icon;
  const currSign = currency === "RUB" ? "₽" : currency;

  return (
    <div className="flex justify-between items-center w-full bg-chat-tertiary-bg border border-chat-secondary-border rounded-xl px-5 py-3">
      <div className="flex gap-3 items-center">
        <div
          className={`flex items-center justify-center rounded-full p-3 ${style.bg}`}
        >
          <Icon className={style.text} size={18} />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-primary-font text-[14px] font-semibold">
            {productName || "Без названия"}
          </h2>
          <p className="text-secondary-font text-[12px]">
            {statusLabel(status)} · {quantity} шт.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-end">
        <h2 className={`text-[14px] font-semibold ${style.text}`}>
          {style.prefix}
          {style.prefix && " "}
          {new Intl.NumberFormat("ru-RU").format(totalPrice)} {currSign}
        </h2>
        <p className="text-secondary-font text-[12px]">{date}</p>
      </div>
    </div>
  );
}

export default TransactionItem;
