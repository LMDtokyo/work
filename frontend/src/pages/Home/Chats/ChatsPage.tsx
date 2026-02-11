import { useState, useCallback, useMemo, useEffect, useRef } from "react";
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

function getPlatformFromPath(path: string): string | null {
  const seg = path.replace("/app/chats/", "").replace("/app/chats", "");
  if (!seg || seg === "all-accounts") return null;
  return seg;
}

export const Chats = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [msgRefresh, setMsgRefresh] = useState(0);
  const [chatFilter, setChatFilter] = useState<ChatFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const location = useLocation();
  const { data: chats } = useChats();
  const chatRef = useRef(selectedChatId);
  chatRef.current = selectedChatId;

  const activePlatform = getPlatformFromPath(location.pathname);

  const platformChats = useMemo(() => {
    if (!chats) return [];
    if (!activePlatform) return chats;
    return chats.filter((c) => c.platform === activePlatform);
  }, [chats, activePlatform]);

  const totalCount = platformChats.length;
  const unreadCount = useMemo(
    () => platformChats.filter((c) => c.unreadCount > 0).length,
    [platformChats],
  );

  const selectedChat = useMemo(
    () => chats?.find((c) => c.id === selectedChatId) ?? null,
    [chats, selectedChatId],
  );

  const onNewMessage = useCallback(
    (payload: { chatId: string }) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      if (payload.chatId === selectedChatId) {
        setMsgRefresh((n) => n + 1);
      }
    },
    [selectedChatId, queryClient],
  );

  const onChatUpdated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["chats"] });
  }, [queryClient]);

  useChatSocket(onNewMessage, onChatUpdated);

  const handleMsgSent = () => {
    setMsgRefresh((n) => n + 1);
    queryClient.invalidateQueries({ queryKey: ["chats"] });
  };

  const closeChat = useCallback(() => setSelectedChatId(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && chatRef.current) {
        e.preventDefault();
        e.stopPropagation();
        setSelectedChatId(null);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, []);

  return (
    <div className="w-full h-full flex gap-2 items-start overflow-hidden relative">
      <div
        className={`w-full md:w-[380px] md:min-w-[380px] h-full flex flex-col gap-3 animate-fade-in-bottom overflow-hidden ${selectedChatId ? "hidden md:flex" : "flex"}`}
      >
        <Searchbar value={searchQuery} onChange={setSearchQuery} />
        <hr className="border-chat-primary-border mx-2" />
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
      <div
        className={`flex flex-col w-full h-full bg-chat-tertiary-bg rounded-2xl p-4 py-3 pb-2 border border-chat-primary-border animate-fade-in-bottom ${!selectedChatId ? "hidden md:flex" : "flex"}`}
      >
        {selectedChatId ? (
          <>
            <div className="flex items-center gap-2 mb-3 md:hidden">
              <button onClick={closeChat} className="text-primary-font">
                ← Назад
              </button>
            </div>
            <ChatWindow
              chatId={selectedChatId}
              customerName={selectedChat?.name || "Покупатель"}
              refreshKey={msgRefresh}
            />
            <ChatInput chatId={selectedChatId} onMessageSent={handleMsgSent} />
          </>
        ) : (
          <div className="h-full text-secondary-font flex items-center justify-center">
            Пока что здесь пусто...
          </div>
        )}
      </div>
    </div>
  );
};
