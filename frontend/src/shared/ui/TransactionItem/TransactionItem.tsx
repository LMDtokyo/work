import { ArrowUpRight } from "lucide-react";

interface ITransactionItem {
  title: string;
  platform: string;
  sum: number;
  date: string;
}

function TransactionItem({ title, platform, sum, date }: ITransactionItem) {
  return (
    <div className="flex justify-between items-center w-full bg-chat-tertiary-bg rounded-xl px-5 py-3">
      <div className="flex gap-3 items-center">
        <div className="flex items-center justify-center rounded-full p-3 bg-green-bg-20">
          <ArrowUpRight className="text-green-bg" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-font-primary text-[14px] font-semibold">
            {title}
          </h2>
          <p className="text-font-secondary text-[12px]">{platform}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 items-end">
        <h2 className="text-[14px] font-semibold text-green-bg">
          + {new Intl.NumberFormat("ru-RU").format(sum)} ₽
        </h2>
        <p className="text-font-secondary text-[12px]">{date}</p>
      </div>
    </div>
  );
}

export default TransactionItem;
