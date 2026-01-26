import { EllipsisVertical } from "lucide-react";
import wildberries from "../../assets/wildberries.svg";

function AccountItem() {
  return (
    <div className="flex flex-col gap-5 bg-chat-tertiary-bg rounded-xl py-4 px-5">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <img src={wildberries} className="w-13 h-13" />
          <div className="flex flex-col">
            <h2 className="text-font-primary text-lg font-semibold">
              Техно маркет
            </h2>
            <p className="text-font-secondary">Wildberries</p>
          </div>
        </div>
        <EllipsisVertical className="text-font-primary cursor-pointer mr-3 w-5" />
      </div>
      <div className="flex gap-3">
        <div className="inline-flex bg-green-bg-20 border border-green-bg rounded-full py-1 px-3 text-green-bg text-sm">
          Подключено
        </div>
        <p className="text-font-secondary">5 мин. назад</p>
      </div>
    </div>
  );
}

export default AccountItem;
