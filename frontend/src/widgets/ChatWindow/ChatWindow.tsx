import { useEffect, useRef, useState } from "react";
import { getChatMessages, type Message } from "../../shared/api/requests/chats";

interface ChatWindowProps {
  chatId: string;
  customerName?: string;
  refreshKey?: number;
}

function ChatWindow({
  chatId,
  customerName = "Покупатель",
  refreshKey = 0,
}: ChatWindowProps) {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(0);

  const fetchMessages = (showLoader: boolean) => {
    if (showLoader) setLoading(true);
    getChatMessages(chatId)
      .then((data) => {
        setMsgs(data);
        if (data.length > prevCount.current) {
          setTimeout(scrollToBottom, 60);
        }
        prevCount.current = data.length;
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    prevCount.current = 0;
    fetchMessages(true);
  }, [chatId]);

  useEffect(() => {
    if (refreshKey > 0) fetchMessages(false);
  }, [refreshKey]);

  const scrollToBottom = () => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  const fmtTime = (s: string) => {
    try {
      const d = new Date(s);
      return (
        d.getHours().toString().padStart(2, "0") +
        ":" +
        d.getMinutes().toString().padStart(2, "0")
      );
    } catch {
      return s;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col gap-2 pb-3 px-2 justify-end">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`flex ${i % 2 ? "justify-start" : "justify-end"}`}
          >
            <div className="animate-pulse bg-chat-secondary-bg rounded-2xl h-12 w-[55%]" />
          </div>
        ))}
      </div>
    );
  }

  if (!msgs.length) {
    return (
      <div className="h-full flex items-center justify-center text-secondary-font">
        Нет сообщений
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto flex flex-col gap-1 pb-3 px-2 scrollbar-thin"
    >
      {msgs.map((m, i) => {
        const prev = msgs[i - 1];
        const showName = m.isFromCustomer && (!prev || !prev.isFromCustomer);

        return (
          <div
            key={m.id}
            className={`flex ${m.isFromCustomer ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[75%] md:max-w-[65%] px-3.5 py-2 ${
                m.isFromCustomer
                  ? "bg-chat-msg-in rounded-2xl rounded-bl-md"
                  : "bg-chat-msg-out rounded-2xl rounded-br-md"
              }`}
            >
              {showName && (
                <div className="text-xs font-semibold text-contrast mb-0.5">
                  {customerName}
                </div>
              )}
              {!m.isFromCustomer && (!prev || prev.isFromCustomer) && (
                <div className="text-xs font-semibold text-contrast mb-0.5">
                  Вы
                </div>
              )}
              <div className="text-sm text-primary-font wrap-break-word whitespace-pre-wrap">
                {m.text}
              </div>
              <div className="text-[11px] mt-0.5 text-secondary-font text-right">
                {fmtTime(m.sentAt)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatWindow;
