import { MessageCircle, MessageCircleOff } from "lucide-react";
import ChatsCategoryItem from "../../shared/ui/ChatsCategoryItem/ChatsCategoryItem";

export type ChatFilter = "all" | "unread";

interface Props {
  filter: ChatFilter;
  onFilterChange: (f: ChatFilter) => void;
  totalCount: number;
  unreadCount: number;
}

function ChatsCategoryItemsList({
  filter,
  onFilterChange,
  totalCount,
  unreadCount,
}: Props) {
  return (
    <div className="flex gap-2 animate-fade-in-right">
      <ChatsCategoryItem
        icon={<MessageCircle width={18} height={18} />}
        title="Все"
        count={totalCount}
        onClick={() => onFilterChange("all")}
        isSelected={filter === "all"}
      />
      <ChatsCategoryItem
        icon={<MessageCircleOff width={18} height={18} />}
        title="Не прочитанные"
        count={unreadCount}
        onClick={() => onFilterChange("unread")}
        isSelected={filter === "unread"}
      />
    </div>
  );
}

export default ChatsCategoryItemsList;
