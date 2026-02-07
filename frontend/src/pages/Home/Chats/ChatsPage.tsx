import { useState } from "react";
import Searchbar from "../../../shared/ui/Searchbar/Searchbar";
import ChatInput from "../../../shared/ui/ChatInput/ChatInput";
import ChatsCategoryItemsList from "../../../widgets/ChatsCategoryItemsList/ChatsCateogoryItemsList";
import ChatItemsList from "../../../widgets/ChatItemsList/ChatItemsList";
import ChatWindow from "../../../widgets/ChatWindow/ChatWindow";

export const Chats = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [msgKey, setMsgKey] = useState(0);

  const handleMsgSent = () => {
    setMsgKey(k => k + 1);
  };

  return (
    <div className="bg-chat-bg w-full h-svh flex gap-2 justify-center items-start overflow-hidden relative pb-4">
      <div className="w-full flex flex-col gap-3 animate-fade-in-bottom">
        <Searchbar />
        <hr className="border-border mx-2" />
        <ChatsCategoryItemsList />
        <ChatItemsList
          selectedChat={selectedChatId}
          onSelectChat={setSelectedChatId}
        />
      </div>
      <div className="flex flex-col w-full h-full bg-linear-to-b from-chat-gradient-bg-1 to-chat-gradient-bg-2 rounded-2xl p-4 py-3 pb-2 border border-primary-border animate-fade-in-bottom">
        {selectedChatId ? (
          <ChatWindow key={msgKey} chatId={selectedChatId} />
        ) : (
          <div className="h-full text-font-secondary flex items-center justify-center">
            Пока что здесь пусто...
          </div>
        )}
        {selectedChatId && <ChatInput chatId={selectedChatId} onMessageSent={handleMsgSent} />}
      </div>
    </div>
  );
};
