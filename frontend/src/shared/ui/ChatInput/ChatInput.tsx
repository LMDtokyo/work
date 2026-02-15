import { useEffect, useRef, useState } from "react";
import SendButton from "../SendButton/SendButton";
import styles from "./ChatInput.module.css";
import { Paperclip, Zap } from "lucide-react";
import { sendMessage } from "../../api/requests/chats";
import FastAnswersModal from "../../../widgets/FastAnswersModal/FastAnswersModal";
import useFastMessage from "../../store/useFastMessage";

interface ChatInputProps {
  chatId: string;
  onMessageSent?: () => void;
  onFileSelect?: (file: File) => void;
}

function ChatInput({ chatId, onMessageSent, onFileSelect }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { message, setMessage } = useFastMessage();

  useEffect(() => {
    if (message) {
      setValue(message);
    }
    setMessage("");
  }, [message.length > 0]);

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

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Выбран файл:", file.name);

      if (onFileSelect) {
        onFileSelect(file);
      }

      e.target.value = "";
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple={false}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        />

        <Paperclip
          className="text-secondary-font cursor-pointer absolute left-4 bottom-4.5 hover:text-primary-font duration-100"
          onClick={handlePaperclipClick}
        />
        <Zap
          className="text-secondary-font cursor-pointer absolute left-12 bottom-4.5 hover:text-primary-font duration-100"
          onClick={() => setIsModalOpen(true)}
        />
        <textarea
          ref={textareaRef}
          className={`bg-chat-secondary-bg rounded-3xl text-primary-font shadow-[0_1px_2px_#00000025] placeholder:text-secondary-font w-full py-2.5 px-14 pl-23 outline-none resize-none min-h-12 max-h-75 h-12 ${styles["input-area"]}`}
          placeholder="Сообщение..."
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
      {isModalOpen && <FastAnswersModal setIsModalOpen={setIsModalOpen} />}
    </>
  );
}

export default ChatInput;
