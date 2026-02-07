import { useChats } from "../../shared/api/hooks/useChats";
import { markChatAsRead } from "../../shared/api/requests/chats";
import defaultAvatar from "../../shared/assets/avatar.jpg";
import ChatItem from "../../shared/ui/ChatItem/ChatItem";

interface ChatItemsListProps {
  selectedChat: string | null;
  onSelectChat: (chatId: string) => void;
}

function ChatItemsList({ selectedChat, onSelectChat }: ChatItemsListProps) {
  const { data: chats, isLoading, refetch } = useChats();

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
      <div className="w-full flex items-center justify-center py-12 text-font-secondary">
        Нет чатов
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2 mt-1">
      {chats.map((chat) => (
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
