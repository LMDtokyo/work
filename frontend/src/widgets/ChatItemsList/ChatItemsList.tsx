import { useMemo } from "react";
import { useChats } from "../../shared/api/hooks/useChats";
import { markChatAsRead, type Chat } from "../../shared/api/requests/chats";
import defaultAvatar from "../../shared/assets/avatar.jpg";
import ChatItem from "../../shared/ui/ChatItem/ChatItem";
import type { ChatFilter } from "../ChatsCategoryItemsList/ChatsCateogoryItemsList";

interface ChatItemsListProps {
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
  filter: ChatFilter;
  search: string;
  platformChats?: Chat[];
}

function ChatItemsList({
  selectedChat,
  onSelectChat,
  filter,
  search,
  platformChats,
}: ChatItemsListProps) {
  const { data: allChats, isLoading, refetch } = useChats();
  const chats = platformChats ?? allChats;

  const filtered = useMemo(() => {
    if (!chats) return [];
    let list = [...chats];

    if (filter === "unread") {
      list = list.filter((c) => c.unreadCount > 0);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.lastMessage && c.lastMessage.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [chats, filter, search]);

  const handleChatClick = async (chatId: string) => {
    onSelectChat(chatId);
    try {
      await markChatAsRead(chatId);
      refetch();
    } catch (err) {
      console.error("Failed to mark chat as read:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-2 mt-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-chat-secondary-bg rounded-xl h-20"
          />
        ))}
      </div>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-12 text-secondary-font">
        Нет чатов
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-12 text-secondary-font">
        Ничего не найдено
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-2 mt-1 overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin">
      {filtered.map((chat) => (
        <ChatItem
          key={chat.id}
          image={chat.avatar || defaultAvatar}
          name={chat.name}
          lastMessage={chat.lastMessage || ""}
          timestamp={chat.lastMessageTime || ""}
          unreadMessages={chat.unreadCount}
          isSelected={selectedChat === chat.id}
          onClick={() => handleChatClick(chat.id)}
        />
      ))}
    </div>
  );
}

export default ChatItemsList;
