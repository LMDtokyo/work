import { useRef, useState } from "react";
import SendButton from "../SendButton/SendButton";
import styles from "./ChatInput.module.css";
import { Paperclip } from "lucide-react";
import { sendMessage } from "../../api/requests/chats";

interface ChatInputProps {
  chatId: string;
  onMessageSent?: () => void;
}

function ChatInput({ chatId, onMessageSent }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "44px";

    const newHeight = Math.min(textarea.scrollHeight, 300);
    textarea.style.height = `${newHeight}px`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(chatId, value.trim());
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "44px";
      }
      onMessageSent?.();
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Paperclip className="text-font-secondary cursor-pointer absolute left-4 bottom-4.5" />
      <textarea
        ref={textareaRef}
        className={`bg-chat-selected-bg rounded-3xl text-font-primary shadow-[0_1px_2px_#00000025] placeholder:text-font-secondary w-full py-2.5 px-14 outline-none resize-none min-h-12 max-h-75 h-12 ${styles["input-area"]}`}
        placeholder="Введите сообщение..."
        onInput={autoResize}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></textarea>
      <SendButton
        className="absolute right-1.5 bottom-2.75"
        isLoading={sending}
        isDisabled={value === "" || sending}
      />
    </form>
  );
}

export default ChatInput;
