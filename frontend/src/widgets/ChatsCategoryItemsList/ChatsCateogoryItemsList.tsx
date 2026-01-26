import { MessageCircle, MessageCircleOff } from "lucide-react";
import ChatsCategoryItem from "../../shared/ui/ChatsCategoryItem/ChatsCategoryItem";
import { useState } from "react";

function ChatsCategoryItemsList() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex gap-2 animate-fade-in-right">
      <ChatsCategoryItem
        icon={<MessageCircle width={18} height={18} />}
        title="Все"
        count={0}
        onClick={() => setSelectedIndex(0)}
        isSelected={selectedIndex === 0}
      />
      <ChatsCategoryItem
        icon={<MessageCircleOff width={18} height={18} />}
        title="Не прочитанные"
        count={2}
        onClick={() => setSelectedIndex(1)}
        isSelected={selectedIndex === 1}
      />
    </div>
  );
}

export default ChatsCategoryItemsList;
