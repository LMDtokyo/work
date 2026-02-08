import { useEffect, useRef, useState } from "react";
import { getChatMessages, type Message } from "../../shared/api/requests/chats";

interface ChatWindowProps {
  chatId: string;
  newMessage?: Message | null;
}

function ChatWindow({ chatId, newMessage }: ChatWindowProps) {
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getChatMessages(chatId)
      .then((data) => {
        if (!cancelled) {
          setMsgs(data);
          setTimeout(scrollToBottom, 80);
        }
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [chatId]);

  // append incoming real-time messages
  useEffect(() => {
    if (!newMessage) return;
    setMsgs(prev => {
      if (prev.some(m => m.id === newMessage.id)) return prev;
      return [...prev, newMessage];
    });
    setTimeout(scrollToBottom, 80);
  }, [newMessage]);

  const scrollToBottom = () => {
    scrollRef.current && (scrollRef.current.scrollTop = scrollRef.current.scrollHeight);
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-font-secondary">
        Загрузка...
      </div>
    );
  }

  if (msgs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-font-secondary">
        История сообщений недоступна.<br/>Вы можете отправить новое сообщение ниже.
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto flex flex-col gap-3 pb-3"
    >
      {msgs.map((m) => (
        <div
          key={m.id}
          className={`flex ${m.isFromCustomer ? "justify-start" : "justify-end"}`}
        >
          <div
            className={`max-w-[70%] md:max-w-[60%] px-4 py-2 rounded-2xl ${
              m.isFromCustomer
                ? "bg-chat-message-customer text-font-primary"
                : "bg-primary text-white"
            }`}
          >
            <div className="text-sm break-words whitespace-pre-wrap">{m.text}</div>
            <div
              className={`text-xs mt-1 ${
                m.isFromCustomer ? "text-font-secondary" : "text-white/70"
              }`}
            >
              {formatTime(m.sentAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
