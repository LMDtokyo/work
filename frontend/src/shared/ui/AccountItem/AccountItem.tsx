import { useState, useRef, useEffect } from "react";
import { EllipsisVertical, Trash2 } from "lucide-react";
import WildberriesIcon from "../../assets/WildberriesIcon";

interface AccountItemProps {
  shopName: string;
  status: string;
  lastSyncAt: string | null;
  tokenExpiresAt: string | null;
  onDelete?: () => void;
}

function getTokenExpiryInfo(expiresAt: string | null): {
  text: string;
  cls: string;
} {
  if (!expiresAt)
    return { text: "Срок неизвестен", cls: "text-font-secondary" };

  const exp = new Date(expiresAt);
  const now = new Date();
  const diffMs = exp.getTime() - now.getTime();
  const days = Math.ceil(diffMs / 86400000);

  if (days <= 0) return { text: "Токен истёк", cls: "text-red-400" };
  if (days <= 14) return { text: `Осталось ${days} дн.`, cls: "text-red-400" };
  if (days <= 30)
    return { text: `Осталось ${days} дн.`, cls: "text-yellow-500" };
  if (days < 5)
    return { text: `Осталось ${days} дня`, cls: "text-green-400/70" };
  return { text: `Осталось ${days} дн.`, cls: "text-green-400/70" };
}

function formatSyncTime(dateStr: string | null): string {
  if (!dateStr) return "Не синхронизировано";

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const mins = Math.floor(diffMs / 60000);

  if (mins < 1) return "Только что";
  if (mins < 60) return `${mins} мин. назад`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ч. назад`;

  return `${Math.floor(hours / 24)} дн. назад`;
}

function getStatusStyle(status: string) {
  const styles: Record<string, { text: string; cls: string }> = {
    active: {
      text: "Подключено",
      cls: "bg-green-bg-20 border-green-bg text-green-bg",
    },
    error: { text: "Ошибка", cls: "bg-red-500/20 border-red-500 text-red-500" },
    inactive: {
      text: "Отключено",
      cls: "bg-gray-500/20 border-gray-500 text-gray-400",
    },
    tokenexpired: {
      text: "Токен истёк",
      cls: "bg-yellow-500/20 border-yellow-500 text-yellow-500",
    },
  };
  return (
    styles[status] || {
      text: status,
      cls: "bg-gray-500/20 border-gray-500 text-gray-400",
    }
  );
}

function AccountItem({
  shopName,
  status,
  lastSyncAt,
  tokenExpiresAt,
  onDelete,
}: AccountItemProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const statusInfo = getStatusStyle(status);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleDelete = () => {
    setMenuOpen(false);
    onDelete?.();
  };

  return (
    <div className="flex flex-col gap-4 bg-chat-tertiary-bg rounded-xl py-4 px-5 relative">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <WildberriesIcon width={48} height={48} />
          <div className="flex flex-col">
            <h2 className="text-font-primary text-lg font-semibold leading-tight">
              {shopName}
            </h2>
            <p className="text-font-secondary text-sm">Wildberries</p>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 hover:bg-chat-secondary-bg rounded transition-colors"
          >
            <EllipsisVertical className="text-font-primary w-5 h-5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-chat-secondary-bg border border-primary-border rounded-lg shadow-lg z-10 min-w-35 py-1">
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-chat-tertiary-bg transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span
          className={`inline-flex border rounded-full py-1 px-3 text-sm ${statusInfo.cls}`}
        >
          {statusInfo.text}
        </span>
        <span className="text-font-secondary text-sm">
          {formatSyncTime(lastSyncAt)}
        </span>
      </div>
      <p className={`text-xs ${getTokenExpiryInfo(tokenExpiresAt).cls}`}>
        {getTokenExpiryInfo(tokenExpiresAt).text}
      </p>
    </div>
  );
}

export default AccountItem;
