import { EllipsisVertical } from "lucide-react";
import wildberries from "../../assets/wildberries.svg";

interface AccountItemProps {
  shopName: string;
  status: string;
  lastSyncAt: string | null;
  onMenuClick?: () => void;
}

function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return "Не синхронизировано";

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Только что";
  if (diffMins < 60) return `${diffMins} мин. назад`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} ч. назад`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} дн. назад`;
}

function getStatusDisplay(status: string) {
  switch (status) {
    case "active":
      return { text: "Подключено", className: "bg-green-bg-20 border-green-bg text-green-bg" };
    case "error":
      return { text: "Ошибка", className: "bg-red-500/20 border-red-500 text-red-500" };
    case "inactive":
      return { text: "Отключено", className: "bg-gray-500/20 border-gray-500 text-gray-400" };
    case "tokenexpired":
      return { text: "Токен истёк", className: "bg-yellow-500/20 border-yellow-500 text-yellow-500" };
    default:
      return { text: status, className: "bg-gray-500/20 border-gray-500 text-gray-400" };
  }
}

function AccountItem({ shopName, status, lastSyncAt, onMenuClick }: AccountItemProps) {
  const statusDisplay = getStatusDisplay(status);

  return (
    <div className="flex flex-col gap-5 bg-chat-tertiary-bg rounded-xl py-4 px-5">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <img src={wildberries} className="w-13 h-13" />
          <div className="flex flex-col">
            <h2 className="text-font-primary text-lg font-semibold">
              {shopName}
            </h2>
            <p className="text-font-secondary">Wildberries</p>
          </div>
        </div>
        <EllipsisVertical
          className="text-font-primary cursor-pointer mr-3 w-5 hover:text-font-secondary"
          onClick={onMenuClick}
        />
      </div>
      <div className="flex gap-3 items-center">
        <div className={`inline-flex border rounded-full py-1 px-3 text-sm ${statusDisplay.className}`}>
          {statusDisplay.text}
        </div>
        <p className="text-font-secondary text-sm">{formatTimeAgo(lastSyncAt)}</p>
      </div>
    </div>
  );
}

export default AccountItem;
