import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Searchbar from "../../../shared/ui/Searchbar/Searchbar";
import ChatInput from "../../../shared/ui/ChatInput/ChatInput";
import ChatsCategoryItemsList from "../../../widgets/ChatsCategoryItemsList/ChatsCateogoryItemsList";
import ChatItemsList from "../../../widgets/ChatItemsList/ChatItemsList";
import ChatWindow from "../../../widgets/ChatWindow/ChatWindow";
import { useChatSocket } from "../../../shared/hooks/useChatSocket";
import type { Message } from "../../../shared/api/requests/chats";

export const Chats = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [lastMsg, setLastMsg] = useState<Message | null>(null);
  const queryClient = useQueryClient();

  const onNewMessage = useCallback((payload: { chatId: string; messageId: string; text: string; isFromCustomer: boolean; sentAt: string }) => {
    // refresh chat list to update last message / unread
    queryClient.invalidateQueries({ queryKey: ["chats"] });

    // if this message is for the currently open chat, push it live
    if (payload.chatId === selectedChatId) {
      setLastMsg({
        id: payload.messageId,
        text: payload.text,
        isFromCustomer: payload.isFromCustomer,
        sentAt: payload.sentAt,
      });
    }
  }, [selectedChatId, queryClient]);

  const onChatUpdated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["chats"] });
  }, [queryClient]);

  useChatSocket(onNewMessage, onChatUpdated);

  const handleMsgSent = () => {
    // after sending, add our message locally (will also come back via SignalR)
    queryClient.invalidateQueries({ queryKey: ["chats"] });
  };

  const handleBackToList = () => {
    setSelectedChatId(null);
  };

  return (
    <div className="bg-chat-bg w-full h-svh flex gap-2 justify-center items-start overflow-hidden relative pb-4 px-2">
      <div className={`w-full max-w-md h-full flex flex-col gap-3 animate-fade-in-bottom overflow-hidden ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        <Searchbar />
        <hr className="border-border mx-2" />
        <ChatsCategoryItemsList />
        <div className="flex-1 overflow-hidden">
          <ChatItemsList
            selectedChat={selectedChatId}
            onSelectChat={setSelectedChatId}
          />
        </div>
      </div>
      <div className={`flex flex-col w-full max-w-4xl h-full bg-linear-to-b from-chat-gradient-bg-1 to-chat-gradient-bg-2 rounded-2xl p-4 py-3 pb-2 border border-primary-border animate-fade-in-bottom ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        {selectedChatId ? (
          <>
            <div className="flex items-center gap-2 mb-3 md:hidden">
              <button onClick={handleBackToList} className="text-font-primary">
                ← Назад
              </button>
            </div>
            <ChatWindow chatId={selectedChatId} newMessage={lastMsg} />
          </>
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
