import { useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Searchbar from "../../../shared/ui/Searchbar/Searchbar";
import ChatInput from "../../../shared/ui/ChatInput/ChatInput";
import ChatsCategoryItemsList from "../../../widgets/ChatsCategoryItemsList/ChatsCateogoryItemsList";
import type { ChatFilter } from "../../../widgets/ChatsCategoryItemsList/ChatsCateogoryItemsList";
import ChatItemsList from "../../../widgets/ChatItemsList/ChatItemsList";
import ChatWindow from "../../../widgets/ChatWindow/ChatWindow";
import { useChatSocket } from "../../../shared/hooks/useChatSocket";
import { useChats } from "../../../shared/api/hooks/useChats";
import type { Message } from "../../../shared/api/requests/chats";

function getPlatformFromPath(path: string): string | null {
  const seg = path.replace("/app/chats/", "").replace("/app/chats", "");
  if (!seg || seg === "all-accounts") return null;
  return seg;
}

export const Chats = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [lastMsg, setLastMsg] = useState<Message | null>(null);
  const [chatFilter, setChatFilter] = useState<ChatFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data: chats } = useChats();

  const activePlatform = getPlatformFromPath(location.pathname);

  const platformChats = useMemo(() => {
    if (!chats) return [];
    if (!activePlatform) return chats;
    return chats.filter(c => c.platform === activePlatform);
  }, [chats, activePlatform]);

  const totalCount = platformChats.length;
  const unreadCount = useMemo(
    () => platformChats.filter(c => c.unreadCount > 0).length,
    [platformChats]
  );

  const onNewMessage = useCallback((payload: { chatId: string; messageId: string; text: string; isFromCustomer: boolean; sentAt: string }) => {
    queryClient.invalidateQueries({ queryKey: ["chats"] });

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
    queryClient.invalidateQueries({ queryKey: ["chats"] });
  };

  const handleBackToList = () => setSelectedChatId(null);

  return (
    <div className="bg-chat-bg w-full h-svh flex gap-2 justify-center items-start overflow-hidden relative pb-4 px-2">
      <div className={`w-full max-w-md h-full flex flex-col gap-3 animate-fade-in-bottom overflow-hidden ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
        <Searchbar value={searchQuery} onChange={setSearchQuery} />
        <hr className="border-border mx-2" />
        <ChatsCategoryItemsList
          filter={chatFilter}
          onFilterChange={setChatFilter}
          totalCount={totalCount}
          unreadCount={unreadCount}
        />
        <div className="flex-1 overflow-hidden">
          <ChatItemsList
            selectedChat={selectedChatId}
            onSelectChat={setSelectedChatId}
            filter={chatFilter}
            search={searchQuery}
            platformChats={platformChats}
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
